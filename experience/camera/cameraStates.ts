export type CameraState = { position: [number,number,number]; target: [number,number,number]; fov: number };
export const cameraStates: Record<'CABINET_HERO' | 'PORTAL_APPROACH' | 'SUNSCAPE_WORLD', CameraState> = {
 CABINET_HERO: { position: [0,0,5.4], target: [0,0,0], fov: 42 },
 PORTAL_APPROACH: { position: [.12,0,5], target: [0,0,0], fov: 42 },
 SUNSCAPE_WORLD: { position: [0,.05,4.4], target: [0,0,0], fov: 42 }
};
