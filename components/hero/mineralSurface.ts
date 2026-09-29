import { MeshPhysicalMaterial, type Vector3 } from "three";
import { rockNoise } from "./rockNoise";
import { rockNoiseTexture } from "./noiseTexture";

export type EnergyUniforms = { uEnergyCenter: { value: Vector3 }; uEnergy: { value: number } };
type StoneOptions = { scale?: number; dust?: number; octaves?: number; tint?: string; energy?: EnergyUniforms; lava?: { value: number } };

/**
 * Procedural volcanic stone. All detail is solid (3D) noise in object space, so it
 * stays attached to moving instances and never shows UV seams.
 * - natural: vesicular basalt with fracture cracks, mineral flecks, oxide stain and settled dust
 * - architectural: dressed basalt blocks with bedding strata, tool-dressed faces and worn polish
 */
export function mineralSurface(architectural = false, options: StoneOptions = {}) {
  const scale = options.scale ?? (architectural ? 1.25 : 1.6);
  const dust = options.dust ?? (architectural ? .35 : .6);
  const material = new MeshPhysicalMaterial({
    color: options.tint ?? "#ffffff",
    metalness: 0,
    roughness: .85,
    clearcoat: architectural ? .18 : 0,
    clearcoatRoughness: .55,
    envMapIntensity: architectural ? .75 : .55,
    sheen: .15,
    sheenRoughness: .9,
    sheenColor: "#6f6a7a",
  });
  material.defines = { ROCK_OCTAVES: options.octaves ?? 5, ROCK_ARCH: architectural ? 1 : 0, ROCK_TEXTURE: "" } as Record<string, number | string>;
  if (options.energy) material.defines.STONE_ENERGY = "";
  if (options.lava) material.defines.STONE_LAVA = "";
  material.onBeforeCompile = shader => {
    shader.uniforms.uRockNoise = { value: rockNoiseTexture() };
    if (options.energy) Object.assign(shader.uniforms, options.energy);
    if (options.lava) shader.uniforms.uLava = options.lava;
    shader.vertexShader = "varying vec3 vStone;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", `
      vStone = transformed;
      #ifdef USE_INSTANCING
        vStone *= vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
        vStone += vec3(float(gl_InstanceID) * 13.17, float(gl_InstanceID) * 7.31, float(gl_InstanceID) * 3.91);
      #else
        vStone *= vec3(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz), length(modelMatrix[2].xyz));
        vStone += modelMatrix[3].xyz * .37;
      #endif
      #include <project_vertex>
    `);
    shader.fragmentShader = `varying vec3 vStone;\n#ifdef STONE_ENERGY\nuniform vec3 uEnergyCenter; uniform float uEnergy;\n#endif\n#ifdef STONE_LAVA\nuniform float uLava;\n#endif\n${rockNoise}\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
      #ifdef STONE_ENERGY
      {
        // Light from the vortex leaks through fractures and wraps the shard silhouettes nearest it.
        vec3 coreView = (viewMatrix * vec4(uEnergyCenter, 1.)).xyz;
        vec3 fragView = -vViewPosition;
        float dist = length(coreView - fragView);
        float near = exp(-dist * dist * .16);
        float toward = max(dot(normal, normalize(coreView - fragView)), 0.);
        float rim = pow(1. - abs(dot(normal, normalize(vViewPosition))), 3.);
        vec3 magenta = mix(vec3(1.5, .2, 1.25), vec3(.55, .3, 1.8), smoothstep(-.3, .6, base));
        totalEmissiveRadiance += magenta * (crack * .55 * toward + rim * rim * .9 + toward * toward * .05) * near * uEnergy;
      }
      #endif
      #ifdef STONE_LAVA
      {
        float molten = smoothstep(0., .055, .055 - cellEdge) * smoothstep(-.05, .5, snoise(P * .45 + 5.));
        float flicker = .8 + .2 * snoise(P * 2. + vec3(0., 0., uLava * 3.));
        totalEmissiveRadiance += vec3(3.2, .85, .12) * molten * flicker * 1.1;
      }
      #endif
    `);
    shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
      vec3 P = vStone * ${scale.toFixed(3)};
      float footprint = max(length(dFdx(P)), length(dFdy(P)));
      // Fade each octave before it reaches pixel frequency (Nyquist): no shimmering, no blocky bump.
      float fineVis = 1. - smoothstep(.016, .042, footprint);
      float microVis = 1. - smoothstep(.004, .011, footprint);
      float base = rkFbm(P * .55);
      float ridge = rkRidged(P * 1.25 + base * .7);
      float cellEdge = rkEdge(P * ${architectural ? ".55" : "1.1"} + base * .45) * .625;
      float crack = (1. - smoothstep(0., .035 + fwidth(cellEdge) * 1.5, cellEdge)) * smoothstep(-.2, .35, snoise(P * .8 + 3.));
      float pits = fineVis * smoothstep(.55, .85, snoise(P * 7.3)) * .9;
      float micro = snoise(P * 11.) * fineVis;
      float grit = snoise(P * 37.) * microVis;
      #if ROCK_ARCH == 1
        float strata = sin(P.y * 6.2 + base * 2.4 + snoise(P * vec3(.3, 2., .3)) * .8);
        float bands = smoothstep(.75, .98, strata);
        float dressed = snoise(vec3(P.x * 2.2, P.y * 26., P.z * 2.2)) * fineVis;
        float stoneH = base * .22 + ridge * .12 + dressed * .06 + micro * .03 + grit * .015 - crack * .35 - bands * .05;
        vec3 albedo = mix(vec3(.030, .029, .033), vec3(.075, .071, .072), smoothstep(-.5, .6, base + ridge * .4));
        albedo = mix(albedo, vec3(.11, .104, .098), bands * .55);
      #else
        float stoneH = base * .38 + ridge * .42 + micro * .08 + grit * .025 - crack * .45 - pits * .12;
        vec3 albedo = mix(vec3(.034, .032, .036), vec3(.098, .091, .088), smoothstep(-.55, .55, base));
        albedo = mix(albedo, vec3(.16, .152, .145), smoothstep(.45, .95, ridge) * .5);
      #endif
      float stain = smoothstep(.25, .85, snoise(P * .22 + 11.)) * (.5 + .5 * snoise(P * 2.1));
      albedo = mix(albedo, albedo * vec3(1.55, 1.12, .78), clamp(stain, 0., 1.) * .45);
      float fleck = step(.78, snoise(P * 46.)) * microVis;
      albedo += vec3(.16, .155, .17) * fleck * .5;
      float cavity = clamp(1. - crack * .8 - pits * .45 - smoothstep(.1, -.6, base) * .35, .08, 1.);
      albedo *= mix(.45, 1., cavity);
      vec3 upView = normalize((viewMatrix * vec4(0., 1., 0., 0.)).xyz);
      float facing = dot(normalize(vNormal), upView);
      float settle = smoothstep(.3, .85, facing + snoise(P * 1.7) * .22 - crack * .5) * ${dust.toFixed(3)};
      albedo = mix(albedo, vec3(.19, .182, .176), settle * .75);
      diffuseColor.rgb *= albedo;
    `);
    shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
      #if ROCK_ARCH == 1
        roughnessFactor = clamp(.5 + base * .12 + dressed * .1 + crack * .35 + settle * .3 - smoothstep(.2, .8, ridge) * .12, .28, .96);
      #else
        roughnessFactor = clamp(.8 + micro * .07 + crack * .15 + settle * .12 - fleck * .5 - smoothstep(.6, .95, ridge) * .12, .3, .98);
      #endif
    `);
    shader.fragmentShader = shader.fragmentShader.replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
      {
        float relief = stoneH * ${architectural ? ".05" : ".1"} * mix(.55, 1., fineVis);
        vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition);
        vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx);
        float det = dot(dpx, r1);
        vec3 grad = sign(det) * (dFdx(relief) * r1 + dFdy(relief) * r2);
        normal = normalize(abs(det) * normal - grad);
        // Specular anti-aliasing: widen the lobe where normals vary within a pixel.
        float variance = max(dot(dFdx(normal), dFdx(normal)), dot(dFdy(normal), dFdy(normal)));
        roughnessFactor = clamp(sqrt(roughnessFactor * roughnessFactor + min(variance * 2., .25)), .2, 1.);
      }
    `);
    shader.fragmentShader = shader.fragmentShader.replace("#include <aomap_fragment>", `#include <aomap_fragment>
      reflectedLight.indirectDiffuse *= cavity;
      reflectedLight.indirectSpecular *= mix(.35, 1., cavity);
      reflectedLight.directDiffuse *= mix(.6, 1., cavity);
    `);
  };
  material.customProgramCacheKey = () => `tierplay-stone-v7-${architectural}-${scale}-${dust}-${options.octaves ?? 5}-${!!options.energy}-${!!options.lava}`;
  return material;
}
