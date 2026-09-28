import { MeshPhysicalMaterial } from "three";
import { noise } from "./portalShaders";

// Object-space detail stays attached to each stone while it moves. Derivative
// normals add relief without another texture download or high-frequency geometry.
export function mineralSurface(architectural = false) {
  const material = new MeshPhysicalMaterial({
    color: architectural ? "#292a32" : "#45434a",
    metalness: architectural ? .12 : .04,
    roughness: architectural ? .29 : .64,
    clearcoat: architectural ? .42 : .06,
    clearcoatRoughness: architectural ? .24 : .48,
    envMapIntensity: architectural ? .9 : .65,
  });
  material.onBeforeCompile = shader => {
    shader.vertexShader = "varying vec3 vStoneSurface;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", `
      vStoneSurface = transformed;
      #ifdef USE_INSTANCING
        vStoneSurface *= vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
      #else
        vStoneSurface *= vec3(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz), length(modelMatrix[2].xyz));
      #endif
      #include <project_vertex>
    `);
    shader.fragmentShader = `varying vec3 vStoneSurface;\n${noise}\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
      vec3 stoneP = vStoneSurface * ${architectural ? "2.4" : "3.1"};
      float stoneGrain = fbm(stoneP);
      float footprint = max(length(dFdx(stoneP)), length(dFdy(stoneP)));
      float fineVisibility = 1. - smoothstep(.025, .12, footprint);
      float stoneFine = mix(.5, noise3(stoneP * 19.), fineVisibility);
      float seamField = dot(stoneP, vec3(.8,.28,.42)) * 1.4 + stoneGrain * 8.;
      float stoneSeam = abs(sin(seamField));
      float stoneVein = 1. - smoothstep(.008, .025 + fwidth(stoneSeam), stoneSeam);
      float fracture = smoothstep(.48,.72,stoneGrain);
      diffuseColor.rgb *= .54 + stoneGrain * .82;
      diffuseColor.rgb += vec3(.012,.014,.018) * stoneVein;
      float stoneRelief = stoneGrain * ${architectural ? ".009" : ".042"} + stoneFine * .0015 - stoneVein * .003;
    `);
    shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
      roughnessFactor = clamp(${architectural ? ".20" : ".52"} + fracture * .23 + stoneFine * .055 - stoneVein * .055, .18, .86);
    `);
    shader.fragmentShader = shader.fragmentShader.replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
      vec3 stoneDx = dFdx(-vViewPosition), stoneDy = dFdy(-vViewPosition);
      vec3 stoneR1 = cross(stoneDy, normal), stoneR2 = cross(normal, stoneDx);
      float stoneDet = dot(stoneDx, stoneR1);
      vec3 stoneGradient = sign(stoneDet) * (dFdx(stoneRelief) * stoneR1 + dFdy(stoneRelief) * stoneR2);
      normal = normalize(max(abs(stoneDet), .000001) * normal - stoneGradient);
      float variance = max(dot(dFdx(normal),dFdx(normal)),dot(dFdy(normal),dFdy(normal)));
      roughnessFactor = clamp(sqrt(roughnessFactor * roughnessFactor + min(variance,.18)),.18,.9);
    `);
    const debug = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("surface-debug");
    if (debug === "roughness" || debug === "veins") {
      shader.fragmentShader = shader.fragmentShader.replace("#include <opaque_fragment>", `outgoingLight = vec3(${debug === "roughness" ? "roughnessFactor" : "stoneVein"});\n#include <opaque_fragment>`);
    }
  };
  material.customProgramCacheKey = () => `tierplay-mineral-relief-v3-${architectural}`;
  return material;
}
