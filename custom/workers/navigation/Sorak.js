import seedrandom from 'seedrandom';
import * as THREE from 'three';
import Planet from './Planet';

let sorakSeed = 731;//Math.random();
console.log('SORAKSEED', sorakSeed);
let sorakRng = seedrandom(sorakSeed);

export default class Sorak {
  constructor(globals, options) {
    this.disposables = [];
    
    this.group = new THREE.Group();
    this.group.position.set(...options.position);
    this.options = options;

    this.place = new Planet(globals, {
      path: 'sorak',
      size: 1,
      rotationSpeed: 0,
      position: [0, 0, 0]
    });
    this.group.add(this.place.group);

    this.beaconMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      opacity: 0.25,
      transparent: true
    });
    this.beacon = new THREE.Mesh(globals.sphereGeometry, this.beaconMaterial);
    this.beacon.position.set(1,0,0);
    let scaleFactor = 0.25;
    this.beacon.scale.set(scaleFactor, scaleFactor, scaleFactor);
    this.beaconGroup = new THREE.Group();
    this.beaconGroup.add(this.beacon);
    this.group.add(this.beaconGroup);
    this.beaconGroup.rotation.set((2*Math.PI*sorakRng()),(2*Math.PI*sorakRng()),(2*Math.PI*sorakRng()))
  }

  update(timeDelta, timeElapsed) {
    this.group.rotation.y = (this.group.rotation.y + timeDelta * -0.25) % (2*Math.PI);
    let factor = (timeElapsed % 1);
    this.beacon.scale.set(0.25 * factor,0.25 * factor,0.25 * factor);
    this.beaconMaterial.opacity = 1-factor;
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