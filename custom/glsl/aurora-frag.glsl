uniform float time;

varying vec2 vUv; 

void main() {
  float value = sin((vUv.x+time/13.0)*8.0*3.14159)/26.0 + 0.8;
  float channel = 1.0 - smoothstep(0.0,0.05, abs(vUv.y-value));
  float othervalue = cos((vUv.x+time/7.0)*4.0*3.14159)/21.0 + 0.8;
  float green = 1.0 - smoothstep(0.0,0.05, abs(vUv.y-othervalue));
  gl_FragColor = vec4( channel, green, channel, max(channel, green) * 0.5 );
  // gl_FragColor = vec4(1.0-step(0.05, abs(vUv.y-0.5)), 0, 0, 0.5);
}