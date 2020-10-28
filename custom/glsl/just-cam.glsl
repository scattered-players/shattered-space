void main() {
  vec3 cam = getCam(uv);
  cam.r = uv.y;
  gl_FragColor = vec4(cam, 1);
}