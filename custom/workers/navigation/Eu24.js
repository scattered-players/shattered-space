import config from 'config';
import seedrandom from 'seedrandom';
import * as THREE from 'three';
import TextureLoader from '../TextureLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import MTLLoader from '../MTLLoader';
import FBXLoader from '../FBXLoader';
import { STLLoader } from 'three/examples//jsm/loaders/STLLoader.js';

export default class Eu24 {
  constructor(globals, options) {
    let eu24Seed = 102; //Math.round(Math.random()*1000);
    console.log('EU24SEED', eu24Seed);
    this.rng = seedrandom(eu24Seed);
    this.disposables = [];
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    this.textureLoader = new TextureLoader(globals.loadingManager, { flipY: false});

    // let asteroidMaterial = new THREE.MeshStandardMaterial({
    //   color: 0x999999,
    //   roughness: 0.7
    // })
    var loader = new FBXLoader(globals.loadingManager);
    loader.setPath(`/media/3d/planets/asteroids/`).load(`asteroids.fbx`, ( object ) => {
      let map = this.getTexture(`/media/3d/planets/eu24/diffuse.png`);
      let normalMap = this.getTexture(`/media/3d/planets/eu24/normal.png`);
      let specularMap = this.getTexture(`/media/3d/planets/eu24/specular.png`);
      let asteroidMaterial = new THREE.MeshStandardMaterial({
        map,
        normalMap,
        normalMapType: THREE.ObjectSpaceNormalMap,
        specularMap
      });
      object.traverse(child => {
        if ( child.isMesh ) {
          // console.log('MESH', child); 
          this.disposables.push(child.geometry);
          // child.position.set(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5);
          // child.material = child.material.map(material => this.getRealMaterial(material));
          child.material = asteroidMaterial;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.asteroids = [...object.children[0].children];
      this.asteroids = this.asteroids.map(asteroid => {
        asteroid.material.dispose();
        asteroid.material = asteroidMaterial;
        let randFactor = 0.15;
        asteroid.position.set(randFactor*(this.rng()-0.5),randFactor*(this.rng()-0.5),randFactor*(this.rng()-0.5));
        let scaleFactor = 0.02;
        asteroid.scale.set(scaleFactor,scaleFactor,scaleFactor);
        this.group.add(asteroid);
        return {
          asteroid,
          rotationAxis: Math.round(this.rng()*3),
          rotationSpeed: 0,//(this.rng() - 0.5)*2,
          defaultRotation: [2*Math.PI*this.rng(),2*Math.PI*this.rng(),2*Math.PI*this.rng()]
        }
      });
      // this.group.add(object)
      console.log('GOTIT', object);
    }, onProgress, onError );

    this.group = new THREE.Group();
    this.group.position.set(...options.position);
    this.options = options;
  }

  getTexture(path) {
    let texture = this.textureLoader.load(path);
    
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat = new THREE.Vector2(1,2);

    return texture;
  }

  update(timeDelta, timeElapsed) {
    if(this.asteroids){
      this.asteroids.map(({asteroid, rotationAxis, rotationSpeed, defaultRotation}) => {
        // console.log('HMM',asteroid, rotationAxis, rotationSpeed, defaultRotation);
        let rotation = [...defaultRotation];
        rotation[rotationAxis] = (timeElapsed * rotationSpeed) % (2*Math.PI);
        asteroid.rotation.set(...rotation);
      })
    }
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