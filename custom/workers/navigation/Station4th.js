import config from 'config';
import * as THREE from 'three';
import TextureLoader from '../TextureLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import MTLLoader from '../MTLLoader';
import FBXLoader from '../FBXLoader';
import { STLLoader } from 'three/examples//jsm/loaders/STLLoader.js';

export default class Station4th {
  constructor(globals, options) {
    this.disposables = [];
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    let mtlLoader = new MTLLoader( globals.loadingManager )
      .setPath(`/media/3d/planets/station4th/` )
      .load( 'export.mtl', materials => {

        materials.preload();
        console.log('MATERIALS', materials.materials);

        new OBJLoader( globals.loadingManager )
          .setMaterials( materials )
          .setPath(`/media/3d/planets/station4th/` )
          .load( 'export-1e-1.obj', object => {
            console.log('GOTIT', object);

            object.children.map((child) => {
              if(child.isMesh) {
                this.disposables.push(child.geometry);
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            object.position.set(0, -0.25, 0);
            let scaleFactor = 0.01;
            object.scale.set(scaleFactor, scaleFactor, scaleFactor);
            this.group.add(object);
          }, onProgress, onError );

      });

    let asteroidMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999,
      roughness: 0.7
    })
    var loader = new FBXLoader(globals.loadingManager);
    loader.setPath(`/media/3d/planets/asteroids/`).load(`asteroids.fbx`, ( object ) => {
      object.traverse(child => {
        if ( child.isMesh ) {
          // console.log('MESH', child); 
          this.disposables.push(child.geometry);
          // child.position.set(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5);
          // child.material = child.material.map(material => this.getRealMaterial(material));
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.asteroids = [...object.children[0].children];
      this.asteroids = this.asteroids.map(asteroid => {
        asteroid.material.dispose();
        asteroid.material = asteroidMaterial;
        let randFactor = 1.5;
        asteroid.position.set(randFactor*(Math.random()-0.5),randFactor*(Math.random()-0.5),randFactor*(Math.random()-0.5));
        let scaleFactor = 0.02;
        asteroid.scale.set(scaleFactor,scaleFactor,scaleFactor);
        this.group.add(asteroid);
        return {
          asteroid,
          rotationAxis: Math.round(Math.random()*3),
          rotationSpeed: (Math.random() - 0.5)*2,
          defaultRotation: [2*Math.PI*Math.random(),2*Math.PI*Math.random(),2*Math.PI*Math.random()]
        }
      });
      // this.group.add(object)
      console.log('GOTIT', object);
    }, onProgress, onError );

    this.group = new THREE.Group();
    this.group.position.set(...options.position);
    this.options = options;
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