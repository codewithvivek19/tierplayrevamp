# Tierplay cabinet Blender files

## Deliverables

- `tierplay-pinnacle-cabinet-v2-reference.blend` — recommended Pinnacle file
- `tierplay-altitude-cabinet-v1.blend`
- `tierplay-pinnacle-cabinet-v1.blend`
- `tierplay-cabinet-blend-files-v1.zip`

The Pinnacle V2 file supersedes the earlier Pinnacle V1 visualization. Its
display shell was rebuilt from the supplied exact-side elevation: the face
sweeps toward the player at the top, the rear spine remains nearly vertical,
and the rear top edge is chamfered. The perimeter light follows that corrected
profile.

The `.blend` files are self-contained and have their image textures packed. They were generated and validated headlessly with Blender 4.5.11 LTS.

## Included setup

- Metric scene units
- Separately named cabinet parts
- Beveled visualization geometry
- Black powder-coated metal, satin plastic, brushed metal and rubber materials
- Emissive violet and cyan trim
- Curved display geometry for Pinnacle
- Flat portrait display geometry for Altitude
- Packed game-screen textures
- Packed official Tierplay logo texture on a dedicated UV badge plane
- Key, fill and rim studio lights
- Ground plane and backdrop
- Front, three-quarter hero, side and rear cameras
- Eevee render configuration

## Validation

- Pinnacle V2: 358 objects, 13 materials, 5 cameras
- Altitude: 53 objects, 12 materials, 4 cameras
- Pinnacle: 52 objects, 12 materials, 4 cameras
- Both files reopened successfully in a separate headless Blender process.
- All file-backed textures reported as packed.
- Front, three-quarter and rear preview renders completed successfully.

Pinnacle V2 additionally includes exact-side and rear-three-quarter cameras.
Its packed source images are the authoritative five-view sheet, the screen
artwork and the official Tierplay logo. The five-view validation render is
`previews/pinnacle-v2-five-view.png`.

## Accuracy boundary

These are production-visualization models, not manufacturing CAD. Pinnacle V2
uses the supplied five-view reference as its sole visible-geometry authority.
The rear sheet itself remains concept artwork rather than manufacturer CAD, so
the model must not be treated as measured engineering data.

Do not use these files for fabrication, compliance, thermal engineering or dimensional claims without approved manufacturer data.

## Rebuilding headlessly

`build_tierplay_cabinets.py` reconstructs either file using the packed-source textures in `textures/`. Set `TIERPLAY_MODEL=Altitude` or `TIERPLAY_MODEL=Pinnacle` before running it through Blender in background mode.

`build_pinnacle_reference_v2.py` reconstructs the corrected Pinnacle V2 file.
`render_pinnacle_reference_views.py` renders all five validation cameras from
the packed `.blend`.
