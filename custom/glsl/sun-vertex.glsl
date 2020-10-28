
varying vec2 vUv;
varying vec3 vPos;

void main() {
  vUv = uv; 
  vPos = position; 

  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}