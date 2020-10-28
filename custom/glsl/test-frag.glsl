precision highp float;

uniform float time;
uniform sampler2D previousTex;
uniform vec2 resolution;

varying vec2 uv;

void main() {
  vec3 color = vec3(uv, 1.0);
  color = texture2D(previousTex, uv).rgb;

  // Do your cool postprocessing here
  color.r = sin(time / 1000.0);
  // color.r += 0.1;
  // color = vec3(
  //   color.b + 0.01,
  //   color.r + 0.01,
  //   color.g + 0.01
  // );

  gl_FragColor = vec4(color, 1.0);
}