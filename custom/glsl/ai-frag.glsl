precision highp float;

uniform sampler2D helmetTex;
uniform sampler2D mouthTex;
uniform sampler2D leftEyeTex;
uniform sampler2D rightEyeTex;
uniform float time;
uniform float distortAmount;
varying vec2 vUv; 
varying vec2 vMouthUv;
varying vec2 vLeftEyeUv;
varying vec2 vRightEyeUv;

void main() {
  vec4 color = vec4(0.);
  vec2 modifier = vec2(distortAmount * sin(vUv.y*150. + time*100.)/100.,0.);
  color += texture2D(helmetTex, vUv+modifier);
  color += texture2D(mouthTex, vMouthUv+modifier);
  color += texture2D(leftEyeTex, vLeftEyeUv+modifier);
  color += texture2D(rightEyeTex, vRightEyeUv+modifier);

  // float eyeDistance = distance(eyePosition, vUv);
  // float decider = step(eyeDistance, 0.1);
  // color = decider * color + (1.-decider) * vec4(1.,0.,0.,1.);
  gl_FragColor = color;
}