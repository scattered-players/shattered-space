precision highp float;

uniform vec3 basecolor;
uniform float mouthsize;
uniform float lefteyesize;
uniform float righteyesize;
varying vec3 vUv; 

void main() {
  vec2 mouth_center = vec2(0., -1.75);
  vec2 left_eye_center = vec2(1.25, 2.25);
  vec2 right_eye_center = vec2(-1.25, 2.25);

  vec2 mouth_distance = vec2(abs(vUv.x - mouth_center.x), abs(vUv.y - mouth_center.y));
  vec2 left_eye_distance = vec2(abs(vUv.x - left_eye_center.x), abs(vUv.y - left_eye_center.y));
  vec2 right_eye_distance = vec2(abs(vUv.x - right_eye_center.x), abs(vUv.y - right_eye_center.y));

  float mouth_step = (1.0 - step(mouth_distance.x, 1.5)*step(mouth_distance.y, mouthsize));
  float left_eye_step = (1.0 - step(left_eye_distance.x, .75)*step(left_eye_distance.y, lefteyesize));
  float right_eye_step = (1.0 - step(right_eye_distance.x, .75)*step(right_eye_distance.y, righteyesize));

  float modifier = mouth_step*left_eye_step*right_eye_step;
  vec3 color = basecolor;
  gl_FragColor = modifier * vec4(color, 0.1);
}