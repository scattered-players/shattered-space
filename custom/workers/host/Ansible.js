import * as THREE from 'three';

import ansibleVertexShader from '../../glsl/ansible-vertex.glsl';
import ansibleFragmentShader from '../../glsl/ansible-fragment.glsl';


export default class Ansible {
  constructor(group) {
    this.timeUniform = { value: 0.0 };
    this.radiusUniform = { value: 0.0 };
    let ansibleGeometry = new THREE.IcosahedronBufferGeometry(3,6);
    let ansibleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: this.timeUniform,
        radius: this.radiusUniform
      },
      vertexShader: ansibleVertexShader,
      fragmentShader: ansibleFragmentShader
    });
    this.ansible = new THREE.Mesh(ansibleGeometry, ansibleMaterial);
    group.add(this.ansible);

    this.render = this.render.bind(this);
  }

  render(elapsedTime){
    this.timeUniform.value = elapsedTime+2;
    this.radiusUniform.value = Math.min(1.5, Math.pow(Math.max(elapsedTime,1e-9)/2, 1/3));
  }
}
