"""Headless Tierplay cabinet visualization builder for Blender 4.5 LTS.

Creates one packed .blend per cabinet with named geometry, PBR materials,
embedded screen/logo textures, studio lighting, cameras, and a preview render.
Geometry behind the photographed front face is a visualization proposal, not CAD.
"""
from __future__ import annotations

import argparse
import math
import os
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parent
TEX = ROOT / "textures"
PREVIEWS = ROOT / "previews"


def clean_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        pass


def collection(name: str):
    coll = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(coll)
    return coll


def move_to(obj, coll):
    for old in list(obj.users_collection):
        old.objects.unlink(obj)
    coll.objects.link(obj)
    return obj


def material(name, color, metallic=0.0, roughness=0.45, emission=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        socket = bsdf.inputs.get("Emission Color") or bsdf.inputs.get("Emission")
        if socket:
            socket.default_value = (*emission, 1)
        strength = bsdf.inputs.get("Emission Strength")
        if strength:
            strength.default_value = emission_strength
    return mat


def image_material(name, image_path: Path, emission_strength=0.45, roughness=0.28):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(str(image_path), check_existing=True)
    tex.interpolation = "Linear"
    links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    emission = bsdf.inputs.get("Emission Color") or bsdf.inputs.get("Emission")
    if emission:
        links.new(tex.outputs["Color"], emission)
    strength = bsdf.inputs.get("Emission Strength")
    if strength:
        strength.default_value = emission_strength
    bsdf.inputs["Roughness"].default_value = roughness
    if "Alpha" in bsdf.inputs:
        links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
    return mat


def apply_mat(obj, mat):
    obj.data.materials.append(mat)
    return obj


def box(name, dims, loc, mat, coll, bevel=0.025, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = obj.modifiers.new("Edge bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 3
    apply_mat(obj, mat)
    return move_to(obj, coll)


def image_plane(name, width, height, loc, mat, coll):
    x=width/2; z=height/2; y=loc[1]
    verts=[(-x,y,-z+loc[2]),(x,y,-z+loc[2]),(x,y,z+loc[2]),(-x,y,z+loc[2])]
    faces=[(0,3,2,1)]  # normal faces the front camera along -Y
    mesh=bpy.data.meshes.new(name+"_Mesh"); mesh.from_pydata(verts,[],faces); mesh.update()
    obj=bpy.data.objects.new(name,mesh); coll.objects.link(obj); apply_mat(obj,mat)
    uv=mesh.uv_layers.new(name="UVMap")
    coords=((0,0),(0,1),(1,1),(1,0))
    for loop,coord in zip(mesh.polygons[0].loop_indices,coords): uv.data[loop].uv=coord
    return obj


def cyl(name, radius, depth, loc, mat, coll, rotation=(math.pi / 2, 0, 0), vertices=48, bevel=0.006):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    if bevel:
        mod = obj.modifiers.new("Edge bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    apply_mat(obj, mat)
    return move_to(obj, coll)


def torus(name, major, minor, loc, mat, coll, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, major_segments=64, minor_segments=12, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    apply_mat(obj, mat)
    return move_to(obj, coll)


def add_back_details(coll, mats, body_width, body_depth, z0, z1):
    rear_y = body_depth / 2 + 0.006
    panel = box("Rear_Service_Door", (body_width * .72, .025, (z1-z0)*.47), (0, rear_y, (z0+z1)*.58), mats["dark"], coll, .012)
    panel["function"] = "Conceptual service access panel"
    for row_z in (z0 + .22, z1 - .22):
        for i in range(9):
            box(f"Rear_Vent_{row_z:.2f}_{i:02d}", (.045, .018, .012), (-.2 + i*.05, rear_y+.02, row_z), mats["black"], coll, .003)
    for x in (-body_width*.32, body_width*.32):
        for z in (z0+.08, z1-.08):
            cyl("Rear_Fastener", .012, .012, (x, rear_y+.026, z), mats["metal"], coll, rotation=(math.pi/2,0,0), vertices=20, bevel=0)
    box("Rear_Power_Inlet", (.16, .025, .07), (0, rear_y+.025, z0+.12), mats["black"], coll, .008)


def logo_badge(coll, mats, loc, dims):
    backing=box("Tierplay_Logo_Badge_Backplate",dims,loc,mats["black"],coll,.008)
    badge=image_plane("Tierplay_Official_Logo",dims[0]*.88,dims[2]*.72,(loc[0],loc[1]-dims[1]/2-.003,loc[2]),mats["logo"],coll)
    badge["brand_asset"] = "Official Tierplay SVG rasterized and packed"
    return backing


def flat_screen(name, coll, mats, width, height, z, y, tilt=0):
    rot = (math.radians(tilt), 0, 0)
    box(name+"_Housing", (width+.085, .16, height+.085), (0, y+.07, z), mats["plastic"], coll, .035, rot)
    screen = box(name+"_Display", (width, .018, height), (0, y-.022, z), mats["screen"], coll, .012, rot)
    screen["display_type"] = "43-inch portrait display concept"
    for x in (-width/2-.046, width/2+.046):
        box(name+"_LED_Trim", (.022, .025, height+.04), (x, y-.045, z), mats["violet"], coll, .008, rot)
    return screen


def curved_panel(name, coll, mat, width, height, zc, front_y, segments=20, backing=False):
    verts=[]; faces=[]; uvs=[]
    rows=segments+1
    for iz in range(rows):
        v=iz/segments
        z=zc-height/2+v*height
        bow=(2*v-1)**2
        y=front_y + .105*bow
        for ix in range(2):
            u=ix
            x=(-width/2 if ix==0 else width/2)
            verts.append((x,y,z)); uvs.append((u,v))
    for iz in range(segments):
        a=iz*2; faces.append((a,a+1,a+3,a+2))
    mesh=bpy.data.meshes.new(name+"_Mesh")
    mesh.from_pydata(verts,[],faces); mesh.update()
    obj=bpy.data.objects.new(name,mesh); coll.objects.link(obj)
    apply_mat(obj,mat)
    uv=mesh.uv_layers.new(name="UVMap")
    for poly in mesh.polygons:
        for li,vi in zip(poly.loop_indices,poly.vertices):
            uv.data[li].uv=uvs[vi]
    solid=obj.modifiers.new("Panel thickness","SOLIDIFY")
    solid.thickness=.12 if backing else .012
    solid.offset=1 if backing else 0
    bevel=obj.modifiers.new("Soft perimeter","BEVEL"); bevel.width=.018 if backing else .008; bevel.segments=3
    return obj


def create_mats(model):
    return {
        "black": material(model+"_BlackPowder", (.012,.014,.019), metallic=.68, roughness=.28),
        "dark": material(model+"_ServicePanel", (.035,.038,.045), metallic=.5, roughness=.34),
        "plastic": material(model+"_SatinPlastic", (.018,.02,.028), metallic=.18, roughness=.23),
        "metal": material(model+"_BrushedMetal", (.21,.23,.27), metallic=.92, roughness=.19),
        "cyan": material(model+"_CyanLED", (.01,.22,.3), metallic=.05, roughness=.15, emission=(.02,.75,1), emission_strength=8),
        "violet": material(model+"_VioletLED", (.18,.01,.35), metallic=.05, roughness=.15, emission=(.65,.02,1), emission_strength=7),
        "screen": image_material(model+"_Screen", TEX/(model.lower()+"-screen.png"), emission_strength=.38),
        "logo": image_material(model+"_OfficialTierplayLogo", TEX/"tierplay-logo.png", emission_strength=.18, roughness=.22),
        "rubber": material(model+"_Rubber", (.006,.007,.009), metallic=0, roughness=.7),
    }


def build_altitude():
    coll=collection("ALTITUDE_MODEL"); mats=create_mats("Altitude")
    box("Altitude_Base_Plinth", (1.08,.72,.16),(0,0,.08),mats["black"],coll,.035)
    box("Altitude_Lower_Cabinet", (.92,.59,.69),(0,.01,.50),mats["dark"],coll,.035)
    box("Altitude_Lower_Toe", (1.02,.68,.18),(0,-.01,.18),mats["black"],coll,.025)
    box("Altitude_Upper_Body", (.88,.47,.39),(0,-.015,1.02),mats["plastic"],coll,.035)
    box("Altitude_Control_Deck", (1.02,.72,.13),(0,-.19,1.25),mats["black"],coll,.055,rotation=(math.radians(-5),0,0))
    box("Altitude_Control_Light", (.58,.035,.055),(0,-.56,1.245),mats["cyan"],coll,.012)
    flat_screen("Altitude",coll,mats,.88,1.43,2.05,-.20,tilt=-2.5)
    # controls and cup holder
    cyl("Altitude_Left_Button",.095,.035,(-.31,-.48,1.35),mats["metal"],coll,rotation=(0,0,0))
    torus("Altitude_Cup_Holder",.092,.014,(0,-.49,1.36),mats["metal"],coll)
    cyl("Altitude_Action_Button",.075,.035,(.31,-.48,1.35),mats["metal"],coll,rotation=(0,0,0))
    box("Altitude_Bill_Acceptor",(.13,.025,.16),(-.28,-.26,1.08),mats["black"],coll,.01)
    cyl("Altitude_Speaker",.055,.025,(.05,-.265,1.09),mats["rubber"],coll)
    box("Altitude_Ticket_Printer",(.18,.025,.11),(.28,-.265,1.09),mats["black"],coll,.012)
    logo_badge(coll,mats,(0,-.271,.91),(.31,.025,.095))
    add_back_details(coll,mats,.88,.59,.18,1.15)
    for x in (-.4,.4): cyl("Altitude_Leveling_Foot",.035,.035,(x,.18,-.015),mats["rubber"],coll,rotation=(0,0,0),vertices=24)
    return coll


def build_pinnacle():
    coll=collection("PINNACLE_MODEL"); mats=create_mats("Pinnacle")
    box("Pinnacle_Base_Plinth", (1.02,.70,.16),(0,0,.08),mats["black"],coll,.035)
    box("Pinnacle_Lower_Cabinet", (.91,.57,.61),(0,.01,.45),mats["dark"],coll,.035)
    box("Pinnacle_Upper_Body", (.86,.44,.44),(0,-.015,1.00),mats["plastic"],coll,.035)
    box("Pinnacle_Control_Deck", (1.00,.64,.12),(0,-.21,1.27),mats["black"],coll,.055)
    box("Pinnacle_Control_Light", (.58,.035,.055),(0,-.545,1.26),mats["cyan"],coll,.012)
    curved_panel("Pinnacle_Screen_Housing",coll,mats["plastic"],.96,1.47,2.10,-.13,backing=True)
    curved_panel("Pinnacle_Curved_Display",coll,mats["screen"],.86,1.37,2.10,-.29,backing=False)
    for x in (-.46,.46):
        box("Pinnacle_LED_Trim",(.022,.026,1.42),(x,-.18,2.10),mats["violet"],coll,.008)
    for x in (-.31,0,.31): cyl("Pinnacle_Control",.067,.034,(x,-.47,1.36),mats["metal"],coll,rotation=(0,0,0))
    for x in (-.235,.235): cyl("Pinnacle_Speaker",.095,.026,(x,-.25,1.00),mats["rubber"],coll)
    box("Pinnacle_Cash_Module",(.46,.03,.15),(0,-.25,1.18),mats["dark"],coll,.012)
    logo_badge(coll,mats,(0,-.267,.98),(.31,.025,.095))
    add_back_details(coll,mats,.88,.57,.16,1.20)
    for x in (-.39,.39): cyl("Pinnacle_Leveling_Foot",.035,.035,(x,.18,-.015),mats["rubber"],coll,rotation=(0,0,0),vertices=24)
    return coll


def look_at(obj, point):
    obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()


def setup_studio(model):
    studio=collection("STUDIO")
    ground_mat=material("Studio_Ground",(.045,.047,.055),metallic=.15,roughness=.34)
    box("Studio_Floor",(20,20,.05),(0,0,-.08),ground_mat,studio,.02)
    # backdrop
    box("Studio_Backdrop",(20,.08,8),(0,8.0,3.4),material("Studio_Backdrop_Mat",(.055,.058,.068),roughness=.55),studio,.02)
    lights=[
        ("Key_Area",(-3,-4,5.5),850,4.0,(.82,.87,1.0)),
        ("Fill_Area",(3,-2.5,3.4),430,3.0,(.65,.48,1.0)),
        ("Rim_Area",(0,2.5,4.5),700,3.0,(.35,.65,1.0)),
    ]
    for name,loc,energy,size,color in lights:
        data=bpy.data.lights.new(name,"AREA"); data.energy=energy; data.shape='DISK'; data.size=size; data.color=color
        obj=bpy.data.objects.new(name,data); studio.objects.link(obj); obj.location=loc; look_at(obj,(0,0,1.5))
    cameras={
        "Camera_Front":((0,-5.6,2.15),(0,0,1.45),62),
        "Camera_Hero_ThreeQuarter":((3.6,-5.2,2.7),(0,0,1.4),67),
        "Camera_Side":((5.2,0,2.0),(0,0,1.45),62),
        "Camera_Rear":((0,6.0,2.2),(0,0,1.45),55),
    }
    for name,(loc,target,lens) in cameras.items():
        data=bpy.data.cameras.new(name); data.lens=lens
        obj=bpy.data.objects.new(name,data); studio.objects.link(obj); obj.location=loc; look_at(obj,target)
    bpy.context.scene.camera=bpy.data.objects["Camera_Hero_ThreeQuarter"]
    world=bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world=world; world.use_nodes=True
    world.node_tree.nodes["Background"].inputs["Color"].default_value=(.012,.014,.022,1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value=.22


def configure_scene(model):
    scene=bpy.context.scene
    scene.render.engine="BLENDER_EEVEE_NEXT"
    scene.render.resolution_x=1024; scene.render.resolution_y=1024; scene.render.resolution_percentage=100
    scene.render.image_settings.file_format="PNG"; scene.render.image_settings.color_mode="RGBA"
    scene.render.film_transparent=False
    scene.render.image_settings.color_depth='8'
    scene.render.resolution_percentage=100
    scene.render.filepath=str(PREVIEWS/(model.lower()+"-cabinet-preview.png"))
    scene.render.engine='BLENDER_EEVEE_NEXT'
    scene.render.image_settings.compression=15
    scene.view_settings.look='AgX - Medium High Contrast'
    scene.unit_settings.system='METRIC'; scene.unit_settings.length_unit='METERS'; scene.unit_settings.scale_length=1.0
    scene["asset_name"]="Tierplay "+model+" cabinet visualization"
    scene["source_fidelity"]="Front silhouette based on recovered public imagery; unseen depth/rear are concept geometry"
    scene["usage"]="Marketing visualization and interaction prototype; not manufacturing CAD"


def main():
    parser=argparse.ArgumentParser(); parser.add_argument("--model",choices=["Altitude","Pinnacle"],default=os.environ.get("TIERPLAY_MODEL"))
    args,unknown=parser.parse_known_args()
    if not args.model:
        raise SystemExit("Set TIERPLAY_MODEL=Altitude or TIERPLAY_MODEL=Pinnacle")
    clean_scene(); PREVIEWS.mkdir(parents=True,exist_ok=True)
    if args.model=="Altitude": build_altitude()
    else: build_pinnacle()
    setup_studio(args.model); configure_scene(args.model)
    # Pack all externally referenced textures into the .blend.
    bpy.ops.file.pack_all()
    out=ROOT/("tierplay-"+args.model.lower()+"-cabinet-v1.blend")
    bpy.ops.wm.save_as_mainfile(filepath=str(out),compress=True)
    bpy.ops.render.render(write_still=True)
    # Save once more so preview/render settings and packed resources are final.
    bpy.ops.wm.save_as_mainfile(filepath=str(out),compress=True)
    print("CREATED",out)


if __name__=="__main__":
    main()
