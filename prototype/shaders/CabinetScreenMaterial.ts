import { ShaderMaterial, Texture } from "three";
/** RGB structure resolves only near screen entry; no idle glitch/scan animation. */
export function createCabinetScreenMaterial(texture: Texture) {
  return new ShaderMaterial({
    uniforms: { uMedia: { value: texture }, uFocus: { value: 0 }, uApproach: { value: 0 }, uCrossing: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `
      uniform sampler2D uMedia; uniform float uFocus; uniform float uApproach; uniform float uCrossing; varying vec2 vUv;
      void main(){
        float grid=mix(640.,90.,smoothstep(.5,1.,uApproach));
        vec2 pixel=floor(vUv*grid)/grid;
        vec2 uv=mix(vUv,pixel,smoothstep(.35,1.,uApproach));
        vec3 color=texture2D(uMedia,uv).rgb;
        float cell=fract(vUv.x*grid*3.);
        vec3 rgb=vec3(1.-smoothstep(.28,.34,cell),step(.33,cell)*(1.-step(.67,cell)),step(.67,cell));
        color*=mix(vec3(1.),rgb*2.,uApproach*.45);
        color*=mix(.65,1.,uFocus);
        // Screen crossing reveals warm-white light; DOM exit takes over without a black frame.
        color=mix(color,vec3(.94,.93,.89),smoothstep(.35,1.,uCrossing));
        gl_FragColor=vec4(color,1.);
        #include <colorspace_fragment>
      }`,
    toneMapped: false,
  });
}
