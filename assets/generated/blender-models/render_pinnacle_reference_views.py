"""Render every reference-validation camera from the packed Pinnacle V2 file."""
from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parent
PREVIEWS = ROOT / "previews"

VIEWS = {
    "Camera_Front_Orthographic": "pinnacle-v2-front.png",
    "Camera_Hero_ThreeQuarter": "pinnacle-v2-hero.png",
    "Camera_Left_Orthographic": "pinnacle-v2-left.png",
    "Camera_Rear_ThreeQuarter": "pinnacle-v2-rear-three-quarter.png",
    "Camera_Rear_Orthographic": "pinnacle-v2-rear.png",
}


scene = bpy.context.scene
scene.render.resolution_x = 1400
scene.render.resolution_y = 1400
scene.render.resolution_percentage = 100
for camera_name, filename in VIEWS.items():
    scene.camera = bpy.data.objects[camera_name]
    scene.render.filepath = str(PREVIEWS / filename)
    bpy.ops.render.render(write_still=True)
    print("RENDERED", camera_name, filename)
