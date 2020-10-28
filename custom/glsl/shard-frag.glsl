uniform float intensity;
varying float vNoise;
varying vec3 vColor;

void main() {
  // gl_FragColor = vec4( vec3(1.), intensity*vNoise );
  // gl_FragColor = vec4( vColor, vNoise * intensity );
  // gl_FragColor = vec4( vec3(1.), step(1.-intensity, vNoise) );
  gl_FragColor = vec4( vColor + intensity, vNoise * intensity );
}