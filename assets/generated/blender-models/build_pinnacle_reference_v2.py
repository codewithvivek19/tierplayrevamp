"""Reference-driven Pinnacle cabinet rebuild.

The five-view turnaround is the only geometry authority. This script does not
invent decorative hardware beyond what is visible in that sheet. Rear service
panels reproduce the supplied concept reference and are not manufacturing CAD.
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
from build_tierplay_cabinets import (  # noqa: E402
    clean_scene, collection, move_to, material, image_material, apply_mat,
    box, cyl, torus, image_plane, look_at,
)

TEX = ROOT / "textures"
PREVIEWS = ROOT / "previews"
REFERENCE = ROOT / "references" / "pinnacle-five-view-authoritative.png"


def bevel(obj, width=.02, segments=3):
    mod = obj.modifiers.new("Manufactured edge radius", "BEVEL")
    mod.width = width
    mod.segments = segments
    return obj


def trapezoid_prism(name, bottom_w, top_w, depth, height, loc, mat, coll, front_inset=0.0, edge=.02):
    """Closed tapered cabinet volume; front_inset offsets only the top front edge."""
    bw=bottom_w/2; tw=top_w/2; d=depth/2; h=height/2
    verts=[
        (-bw,-d,-h),(bw,-d,-h),(bw,d,-h),(-bw,d,-h),
        (-tw,-d+front_inset,h),(tw,-d+front_inset,h),(tw,d,h),(-tw,d,h),
    ]
    faces=[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(4,0,3,7)]
    mesh=bpy.data.meshes.new(name+"_Mesh"); mesh.from_pydata(verts,[],faces); mesh.update()
    obj=bpy.data.objects.new(name,mesh); coll.objects.link(obj); obj.location=loc; apply_mat(obj,mat); bevel(obj,edge)
    return obj


def curve_strip(name, points, radius, mat, coll):
    curve=bpy.data.curves.new(name+"_Curve","CURVE")
    curve.dimensions='3D'; curve.resolution_u=2; curve.bevel_depth=radius; curve.bevel_resolution=3
    spline=curve.splines.new('BEZIER'); spline.bezier_points.add(len(points)-1)
    for bp,co in zip(spline.bezier_points,points):
        bp.co=co; bp.handle_left_type='AUTO'; bp.handle_right_type='AUTO'
    obj=bpy.data.objects.new(name,curve); coll.objects.link(obj); apply_mat(obj,mat)
    return obj


def curved_screen_surface(name, width, z_values, y_values, mat, coll, thickness=.012, bevel_width=.008, solid_offset=0):
    """Vertically curved front sheet with stable 0..1 UV coordinates."""
    steps=len(z_values)-1; verts=[]; uvcoords=[]; faces=[]
    for row,(z,y) in enumerate(zip(z_values,y_values)):
        v=row/steps
        for x,u in ((-width/2,0),(width/2,1)):
            verts.append((x,y,z)); uvcoords.append((u,v))
    for row in range(steps):
        i=row*2; faces.append((i,i+2,i+3,i+1))
    mesh=bpy.data.meshes.new(name+"_Mesh"); mesh.from_pydata(verts,[],faces); mesh.update()
    obj=bpy.data.objects.new(name,mesh); coll.objects.link(obj); apply_mat(obj,mat)
    uv=mesh.uv_layers.new(name="UVMap")
    for poly in mesh.polygons:
        for li,vi in zip(poly.loop_indices,poly.vertices): uv.data[li].uv=uvcoords[vi]
    solid=obj.modifiers.new("Physical panel thickness","SOLIDIFY"); solid.thickness=thickness; solid.offset=solid_offset
    if bevel_width: bevel(obj,bevel_width,3)
    return obj


def curved_housing_volume(name, width, z_values, front_y, rear_y, mat, coll, edge=.018, rear_z=None):
    """Closed display shell with independently traced front and rear side profiles.

    A Solidify modifier would copy the front curvature onto the rear edge. The
    supplied side elevation instead shows a screen that sweeps forward toward
    the top while the rear spine remains almost vertical, so both outlines are
    modeled explicitly here.
    """
    verts=[]; faces=[]
    rear_z = rear_z or z_values
    for z,rz,fy,ry in zip(z_values,rear_z,front_y,rear_y):
        verts.extend(((-width/2,fy,z),(width/2,fy,z),(-width/2,ry,rz),(width/2,ry,rz)))
    for row in range(len(z_values)-1):
        i=row*4; n=i+4
        faces.extend((
            (i,n,n+1,i+1),          # front
            (i+3,n+3,n+2,i+2),      # rear
            (i+2,n+2,n,i),          # left side
            (i+1,n+1,n+3,i+3),      # right side
        ))
    faces.extend(((0,1,3,2),(len(verts)-4,len(verts)-2,len(verts)-1,len(verts)-3)))
    mesh=bpy.data.meshes.new(name+"_Mesh"); mesh.from_pydata(verts,[],faces); mesh.update()
    obj=bpy.data.objects.new(name,mesh); coll.objects.link(obj); apply_mat(obj,mat); bevel(obj,edge,3)
    return obj


def vent_grid(prefix, x0, z0, cols, rows, sx, sz, y, radius, mat, coll):
    for row in range(rows):
        offset=(sx*.5 if row%2 else 0)
        for col in range(cols):
            x=x0+(col-(cols-1)/2)*sx+offset
            z=z0+(row-(rows-1)/2)*sz
            cyl(f"{prefix}_{row:02d}_{col:02d}",radius,.012,(x,y,z),mat,coll,rotation=(math.pi/2,0,0),vertices=12,bevel=0)


def add_reference_guide(coll):
    img=bpy.data.images.load(str(REFERENCE),check_existing=True)
    img.pack()
    bpy.ops.object.empty_add(type='IMAGE',location=(0,1.25,1.65),rotation=(math.pi/2,0,0))
    obj=bpy.context.object; obj.name="REFERENCE_Pinnacle_Five_View"; obj.data=img
    obj.empty_display_size=4.0; obj.color[3]=.65; obj.hide_render=True; obj.hide_viewport=True
    move_to(obj,coll)


def build_materials():
    screen=bpy.data.materials.new("Pinnacle_Packed_Screen")
    screen.use_nodes=True
    nodes=screen.node_tree.nodes; links=screen.node_tree.links; nodes.clear()
    output=nodes.new("ShaderNodeOutputMaterial")
    tex=nodes.new("ShaderNodeTexImage"); tex.image=bpy.data.images.load(str(TEX/"pinnacle-screen.png"),check_existing=True)
    emission=nodes.new("ShaderNodeEmission"); emission.inputs["Strength"].default_value=.62
    links.new(tex.outputs["Color"],emission.inputs["Color"]); links.new(emission.outputs["Emission"],output.inputs["Surface"])
    return {
        "powder":material("Pinnacle_Powder_Coated_Steel",(.018,.020,.025),metallic=.72,roughness=.31),
        "panel":material("Pinnacle_Service_Panels",(.032,.034,.040),metallic=.55,roughness=.35),
        "plastic":material("Pinnacle_Satin_Black_Trim",(.010,.011,.014),metallic=.18,roughness=.24),
        "metal":material("Pinnacle_Brushed_Stainless",(.24,.26,.29),metallic=.94,roughness=.19),
        "rubber":material("Pinnacle_Rubber",(.003,.004,.005),roughness=.72),
        "cyan":material("Pinnacle_Cyan_LED",(.005,.12,.18),roughness=.16,emission=(.01,.72,1),emission_strength=7),
        "violet":material("Pinnacle_Violet_LED",(.16,.005,.3),roughness=.16,emission=(.62,.02,1),emission_strength=6),
        "screen":screen,
        "logo":image_material("Pinnacle_Official_Tierplay_Logo",TEX/"tierplay-logo.png",emission_strength=.12,roughness=.24),
        "vent":material("Pinnacle_Vent_Depth",(.001,.002,.003),metallic=.1,roughness=.8),
    }


def build_model():
    model=collection("PINNACLE_REFERENCE_MODEL")
    guides=collection("REFERENCE_GUIDES_HIDDEN")
    mats=build_materials()

    # Root enables clean turntable animation without grouping visible pieces.
    root=bpy.data.objects.new("Pinnacle_Root",None); model.objects.link(root)

    # Stepped floor plinth and service drawer exactly follow the front/side proportions.
    trapezoid_prism("Pinnacle_Floor_Plinth",1.06,.98,.80,.16,(0,.02,.08),mats["powder"],model,edge=.028)
    trapezoid_prism("Pinnacle_Lower_Skirt",.98,.90,.72,.17,(0,.02,.245),mats["panel"],model,edge=.022)
    box("Pinnacle_Lower_Cabinet",(.90,.64,.53),(0,.02,.59),mats["powder"],model,.035)
    box("Pinnacle_Drawer_Face",(.78,.025,.36),(0,-.313,.60),mats["panel"],model,.018)
    box("Pinnacle_Drawer_Handle_Recess",(.17,.025,.055),(0,-.332,.61),mats["vent"],model,.008)
    box("Pinnacle_Drawer_Handle_Lip",(.13,.028,.018),(0,-.353,.592),mats["metal"],model,.005)
    cyl("Pinnacle_Drawer_Lock",.018,.012,(0,-.334,.755),mats["metal"],model,rotation=(math.pi/2,0,0),vertices=24,bevel=.002)
    box("Pinnacle_Cabinet_Top_Slab",(1.00,.73,.12),(0,-.015,.915),mats["powder"],model,.028)

    # Mid-body is narrower, with twin speakers and centered exact Tierplay badge.
    trapezoid_prism("Pinnacle_Mid_Body",.80,.77,.53,.47,(0,-.005,1.19),mats["panel"],model,front_inset=.015,edge=.030)
    for x in (-.245,.245):
        cyl("Pinnacle_Front_Speaker",.112,.026,(x,-.283,1.18),mats["vent"],model,rotation=(math.pi/2,0,0),vertices=64,bevel=.004)
        vent_grid("Pinnacle_Speaker_Perforation",x,1.18,7,6,.025,.025,-.299,.006,mats["rubber"],model)
    badge=box("Pinnacle_Logo_Backplate",(.31,.026,.112),(0,-.288,1.18),mats["plastic"],model,.012)
    image_plane("Pinnacle_Official_Tierplay_Badge",.275,.083,(0,-.304,1.18),mats["logo"],model)

    # The projected deck has three circular controls and illuminated front bar/end pods.
    trapezoid_prism("Pinnacle_Control_Deck",1.02,.96,.72,.14,(0,-.22,1.48),mats["powder"],model,front_inset=.025,edge=.055)
    box("Pinnacle_Cyan_Lightbar_Housing",(.58,.052,.080),(0,-.575,1.465),mats["plastic"],model,.018)
    box("Pinnacle_Cyan_Lightbar",(.52,.018,.045),(0,-.608,1.47),mats["cyan"],model,.012)
    for x in (-.445,.445):
        box("Pinnacle_Deck_End_Pod",(.14,.18,.12),(x,-.49,1.49),mats["plastic"],model,.050)
        box("Pinnacle_End_Pod_LED",(.022,.035,.065),(x,-.594,1.49),mats["cyan"],model,.008)
    for x,r in ((-.31,.073),(0,.066),(.31,.073)):
        cyl("Pinnacle_Player_Control",r,.038,(x,-.43,1.57),mats["metal"],model,rotation=(0,0,0),vertices=64,bevel=.008)
        cyl("Pinnacle_Control_Inlay",r*.73,.042,(x,-.43,1.577),mats["plastic"],model,rotation=(0,0,0),vertices=64,bevel=.006)

    # Sloped I/O fascia visible immediately below the screen.
    trapezoid_prism("Pinnacle_IO_Fascia",.82,.79,.39,.28,(0,-.03,1.69),mats["panel"],model,front_inset=.075,edge=.025)
    box("Pinnacle_Left_Module_Plate",(.18,.025,.16),(-.275,-.255,1.69),mats["metal"],model,.010)
    box("Pinnacle_Square_Button",(.055,.025,.055),(-.08,-.258,1.69),mats["metal"],model,.010)
    cyl("Pinnacle_Center_Service_Button",.052,.025,(.06,-.258,1.69),mats["metal"],model,rotation=(math.pi/2,0,0),vertices=48,bevel=.005)
    box("Pinnacle_Ticket_Slot",(.18,.025,.075),(.275,-.258,1.69),mats["plastic"],model,.010)

    # Curved portrait display traced from the authoritative exact-side view.
    # The supplied cabinet sweeps progressively toward the player at the top;
    # it does not bulge forward through the middle. The rear spine stays nearly
    # vertical, so it is defined separately from the display face.
    z=[1.81,2.08,2.42,2.78,3.14]
    shell_y=[-.130,-.160,-.190,-.215,-.230]
    rear_y=[.045,.055,.055,.040,.010]
    screen_y=[v-.012 for v in shell_y]
    curved_housing_volume(
        "Pinnacle_Curved_Screen_Housing",.96,z,shell_y,rear_y,mats["powder"],model,
        edge=.025,rear_z=[1.81,2.08,2.42,2.78,3.07],
    )
    curved_screen_surface("Pinnacle_Curved_Display",.84,[v+.045 for v in z],screen_y,mats["screen"],model,thickness=.012,bevel_width=.008)
    # Black bezel rails and reference-matched luminous perimeter.
    left_pts=[(-.445,screen_y[i]-.006,z[i]+.045) for i in range(len(z))]
    right_pts=[(.445,screen_y[i]-.006,z[i]+.045) for i in range(len(z))]
    curve_strip("Pinnacle_Left_Cyan_Perimeter",left_pts,.014,mats["cyan"],model)
    curve_strip("Pinnacle_Right_Violet_Perimeter",right_pts,.014,mats["violet"],model)
    curve_strip("Pinnacle_Top_Perimeter",[(-.445,screen_y[-1]-.006,z[-1]+.045),(0,screen_y[-1]-.012,z[-1]+.055),(.445,screen_y[-1]-.006,z[-1]+.045)],.014,mats["violet"],model)
    curve_strip("Pinnacle_Bottom_Perimeter",[(-.445,screen_y[0]-.006,z[0]+.045),(0,screen_y[0]-.012,z[0]+.035),(.445,screen_y[0]-.006,z[0]+.045)],.014,mats["cyan"],model)

    # Rear panels reproduce only the hardware visible in the supplied rear views.
    box("Pinnacle_Rear_Display_Service_Door",(.69,.026,.72),(0,.071,2.53),mats["panel"],model,.018)
    box("Pinnacle_Rear_Display_Handle",(.15,.028,.065),(0,.090,2.32),mats["vent"],model,.008)
    cyl("Pinnacle_Rear_Display_Lock",.017,.014,(0,.091,2.58),mats["metal"],model,rotation=(math.pi/2,0,0),vertices=24,bevel=.002)
    vent_grid("Pinnacle_Upper_Rear_Vent",0,2.93,13,4,.040,.035,.051,.009,mats["vent"],model)
    box("Pinnacle_Rear_Display_Lower_Panel",(.70,.026,.26),(0,.074,1.99),mats["panel"],model,.015)
    vent_grid("Pinnacle_Display_Lower_Rear_Vent",0,1.99,11,4,.040,.032,.091,.008,mats["vent"],model)
    box("Pinnacle_Rear_Mid_Service_Door",(.67,.027,.43),(0,.285,1.20),mats["panel"],model,.015)
    vent_grid("Pinnacle_Mid_Rear_Vent",0,1.32,11,4,.042,.035,.307,.009,mats["vent"],model)
    box("Pinnacle_Rear_Lower_Power_Panel",(.55,.028,.16),(0,.355,.54),mats["panel"],model,.012)
    box("Pinnacle_Rear_Power_Inlet",(.12,.029,.06),(0,.375,.54),mats["vent"],model,.007)
    for x in (-.22,.22): vent_grid("Pinnacle_Lower_Rear_Vent",x,.54,4,3,.030,.030,.375,.007,mats["vent"],model)
    # Side speaker vents shown in the exact side view.
    for x in (-.402,.402):
        side=1 if x>0 else -1
        for row in range(5):
            for col in range(5):
                zc=1.10+(row-2)*.025; yc=-.02+(col-2)*.025
                cyl("Pinnacle_Side_Vent",.007,.014,(x,yc,zc),mats["vent"],model,rotation=(0,math.pi/2,0),vertices=10,bevel=0)
    for x in (-.39,.39):
        cyl("Pinnacle_Adjustable_Foot",.036,.035,(x,.18,-.015),mats["rubber"],model,rotation=(0,0,0),vertices=32,bevel=.003)

    # Parent only physical cabinet parts, keeping studio/reference independent.
    for obj in model.objects:
        if obj is not root: obj.parent=root
    add_reference_guide(guides)
    return root, mats


def setup_scene():
    studio=collection("STUDIO")
    ground=material("Studio_Matte_Ground",(.055,.058,.064),metallic=.08,roughness=.42)
    box("Studio_Floor",(20,20,.05),(0,0,-.08),ground,studio,.02)
    box("Studio_Backdrop",(20,.08,8),(0,8,3.4),material("Studio_Backdrop",(.11,.11,.115),roughness=.62),studio,.02)
    for name,loc,energy,size,color in (
        ("Studio_Key",(-3.5,-4.5,5.6),900,4.2,(.88,.91,1.0)),
        ("Studio_Fill",(3.5,-2.7,3.4),500,3.0,(.65,.52,1.0)),
        ("Studio_Rim",(0,3.0,4.8),760,3.4,(.35,.67,1.0)),
        # Neutral inspection fills keep the exact side and rear views legible.
        # They are deliberately broad/soft so they reveal construction without
        # creating a second, flattering hero-light treatment.
        ("Studio_Side_Inspection",(-4.2,.6,3.5),430,3.8,(.78,.84,1.0)),
        ("Studio_Rear_Inspection",(3.0,4.2,3.7),390,3.6,(.72,.80,1.0)),
    ):
        data=bpy.data.lights.new(name,"AREA"); data.energy=energy; data.shape='DISK'; data.size=size; data.color=color
        obj=bpy.data.objects.new(name,data); studio.objects.link(obj); obj.location=loc; look_at(obj,(0,0,1.55))

    specs={
        "Camera_Hero_ThreeQuarter":("PERSP",(3.9,-5.7,3.0),(0,-.02,1.55),65),
        "Camera_Front_Orthographic":("ORTHO",(0,-7,1.55),(0,0,1.55),3.55),
        "Camera_Left_Orthographic":("ORTHO",(-7,0,1.55),(0,0,1.55),3.55),
        "Camera_Rear_ThreeQuarter":("PERSP",(3.9,5.7,3.0),(0,.02,1.55),65),
        "Camera_Rear_Orthographic":("ORTHO",(0,6.8,1.55),(0,0,1.55),3.55),
    }
    for name,(kind,loc,target,value) in specs.items():
        data=bpy.data.cameras.new(name); data.type=kind
        if kind=="ORTHO": data.ortho_scale=value
        else: data.lens=value
        obj=bpy.data.objects.new(name,data); studio.objects.link(obj); obj.location=loc; look_at(obj,target)
    scene=bpy.context.scene; scene.camera=bpy.data.objects["Camera_Hero_ThreeQuarter"]
    scene.render.engine="BLENDER_EEVEE_NEXT"; scene.render.resolution_x=1400; scene.render.resolution_y=1400; scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='PNG'; scene.render.image_settings.color_mode='RGBA'; scene.render.image_settings.compression=15
    scene.view_settings.look='AgX - Medium High Contrast'; scene.unit_settings.system='METRIC'; scene.unit_settings.length_unit='METERS'
    world=scene.world or bpy.data.worlds.new("World"); scene.world=world; world.use_nodes=True
    world.node_tree.nodes["Background"].inputs["Color"].default_value=(.022,.024,.032,1); world.node_tree.nodes["Background"].inputs["Strength"].default_value=.32
    scene["model_status"]="Reference-driven visualization model"
    scene["geometry_authority"]="pinnacle-five-view-authoritative.png"
    scene["accuracy_boundary"]="Visible reference features only; not manufacturing CAD"


def main():
    clean_scene(); PREVIEWS.mkdir(parents=True,exist_ok=True)
    build_model(); setup_scene(); bpy.ops.file.pack_all()
    out=ROOT/"tierplay-pinnacle-cabinet-v2-reference.blend"
    bpy.context.scene.render.filepath=str(PREVIEWS/"pinnacle-v2-reference-hero.png")
    bpy.ops.wm.save_as_mainfile(filepath=str(out),compress=True)
    bpy.ops.render.render(write_still=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(out),compress=True)
    print("CREATED",out)


if __name__=="__main__": main()
