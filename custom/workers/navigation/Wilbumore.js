import config from 'config';
import * as THREE from 'three';
import TextureLoader from '../TextureLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import MTLLoader from '../MTLLoader';
import FBXLoader from '../FBXLoader';
import Planet from './Planet';

import vertexShader from '../../glsl/vertex.glsl';
import auroraFragShader from '../../glsl/aurora-frag.glsl';

export default class Wilbumore {
  constructor(globals, options) {
    this.disposables = [];
    
    this.group = new THREE.Group();
    this.group.position.set(...options.position);
    this.options = options;

    this.place = new Planet(globals, {
      path: 'wilbumore',
      size: 1,
      rotationSpeed: 0,
      position: [0,0,0]
    });
    this.group.add(this.place.group);

    this.auroraMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: auroraFragShader,
      transparent: true,
      uniforms: {
        time: {
          value: 0
        }
      }
    });
    this.disposables.push(this.auroraMaterial);
    this.aurora = new THREE.Mesh(globals.sphereGeometry, this.auroraMaterial);
    this.aurora.scale.set(1.05, 1.05, 1.05);
    this.group.add(this.aurora);
  }

  update(timeDelta, timeElapsed) {
    this.place.group.rotation.y = (this.place.group.rotation.x + timeDelta * 0.25) % (2*Math.PI);
    this.auroraMaterial.uniforms.time.value = timeElapsed;
  }

  dispose() {
    this.disposables.map(asset => {
      try {
        asset.dispose();
      } catch (e){
        console.error('DISPOSAL ERROR', asset);
        console.error(e);
      }
    });
  }
}