// boring "pass-through" vertex shader
precision highp float;
attribute vec2 position;
uniform float mouthY;
uniform float eyeY;
uniform float jawOpen;
uniform float eyeBlinkLeft;
uniform float eyeBlinkRight;
varying vec2 vUv;
varying vec2 vMouthUv;
varying vec2 vLeftEyeUv;
varying vec2 vRightEyeUv;

void main () {
  vUv = (position * vec2(0.5, 0.5)) + vec2(0.5, 0.5);
  vMouthUv = vec2(vUv.x,(jawOpen*(vUv.y-mouthY))+mouthY);
  vLeftEyeUv = vec2(vUv.x,(eyeBlinkLeft*(vUv.y-eyeY))+eyeY);
  vRightEyeUv = vec2(vUv.x,(eyeBlinkRight*(vUv.y-eyeY))+eyeY);
  gl_Position = vec4(position,0, 1);
}