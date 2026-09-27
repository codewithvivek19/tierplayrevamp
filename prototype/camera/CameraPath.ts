import { CatmullRomCurve3, Object3D, Vector3 } from "three";
export interface CameraPose { position: Vector3; target: Vector3; fov: number }
export function anchor(root: Object3D, name: string) {
  const object = root.getObjectByName(name);
  if (!object) throw new Error(`Required scene anchor ${name} is missing.`);
  return object.getWorldPosition(new Vector3());
}
export function makeCameraPaths(room: Object3D, cabinet: Object3D, mobile: boolean) {
  const floor = anchor(room, mobile ? "MobileFloorCamera" : "FloorCamera");
  const focus = anchor(room, mobile ? "MobileFocusCamera" : "FocusCamera");
  const screen = anchor(cabinet, "ScreenCenter");
  const normal = anchor(cabinet, "ScreenNormal").sub(screen);
  if (normal.lengthSq() < 0.000001) throw new Error("ScreenNormal must be in front of ScreenCenter.");
  normal.normalize();
  const near = screen.clone().addScaledVector(normal, 0.16);
  const inside = screen.clone().addScaledVector(normal, -0.08);
  return {
    entrance: new CatmullRomCurve3(mobile ? [focus, floor] : [anchor(room, "EntryCamera"), anchor(room, "EntryWaypoint"), floor]),
    floor, focus, screen, near, inside,
    floorTarget: anchor(room, "FloorLookAt"),
    focusTarget: anchor(room, "FocusLookAt"),
    entryTarget: mobile ? anchor(room, "FocusLookAt") : anchor(room, "EntryLookAt"),
  };
}
