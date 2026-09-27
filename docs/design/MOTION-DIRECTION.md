# Proposed motion direction

Weighted, reversible and skippable. A phase machine owns progress, CameraDirector owns camera position/target/FOV, LightingDirector owns state lighting, TransitionDirector owns the screen crossing, Motion owns menu/form component transitions. Scroll requests semantic phase progress; it never writes camera.position directly.

Boot waits only for real critical resources. Entrance is 2–4s desktop / 0.8–1.4s mobile and skippable. Focus is 350–500ms with 5–15cm lateral shift, not object scaling. Selection dolly 1.2–2.2s; glass reflection reduces as resolving pixel grid takes over. Reverse/cancel returns deterministically to focus. Reduced motion uses product stills and scene cuts; screen metadata remains identical.

Micro150–300ms; UI250–500ms; section500–1200ms; camera800–3000ms; cinematic2–8s upper envelope. Centralize constants at implementation. No compulsory audio or invented connection statuses. Emission changes serve cabinet focus; remove ambient particles unless part of purposeful screen/network communication.
