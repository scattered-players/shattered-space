import config from 'config';
import * as THREE from 'three';
import TextureLoader from '../TextureLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import MTLLoader from '../MTLLoader';
import FBXLoader from '../FBXLoader';
import Planet from './Planet';

export default class SkavoStation {
  constructor(globals, options) {
    this.disposables = [];
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    var loader = new FBXLoader(globals.loadingManager);
    loader.setPath(`/media/3d/planets/skavo/`).load( `spacestation-0.fbx`, ( object ) => {
      // let normalMap = new TGALoader().load(`/media/3d/planets/station9/Textures/Station_normals.tga`),
      //   specularMap = new TGALoader().load(`/media/3d/ships/f/Textures/Common-textures/Starship_Metallic.png`),
      //   map = new TGALoader().load(`/media/3d/planets/station9/Textures/Station_diffuse.tga`);
      //   normalMap.flipY = true;
      //   specularMap.flipY = true;
      //   map.flipY = true;
      //   let material = new THREE.MeshPhongMaterial({
      //     specularMap,
      //     normalMap,
      //     map
      //   });
      // this.disposables = this.disposables.concat([
      //   normalMap,
      //   specularMap,
      //   map,
      //   material
      // ]);

      // var cubeShader = THREE.ShaderLib[ 'cube' ];

      // var cubeMaterial = new THREE.ShaderMaterial( {
      //   uniforms: THREE.UniformsUtils.clone( cubeShader.uniforms ),
      //   fragmentShader: cubeShader.fragmentShader,
      //   vertexShader: cubeShader.vertexShader,
      //   depthWrite: false,
      // } );

      // cubeMaterial.envMap = globals.skybox;
      var skavoMaterial = new THREE.MeshPhysicalMaterial( {
        // color: 0x0055ff,
        envMap: globals.envMap,
        envMapIntensity: 1.0,
        metalness: 0.99,
        roughness: 0.0,
        reflectivity: 1.0,
      })
      this.disposables.push(skavoMaterial);

      object.traverse(( child ) => {
        if ( child.isMesh ) {
          // console.log('MESH', child); 
          this.disposables.push(child.geometry);
          child.material = skavoMaterial
          child.castShadow = true;
          child.receiveShadow = true;
        }
      } );
      console.log(object.scale);
      object.position.set(0,0,0);
      let scaleFactor = 0.01;
      object.scale.set(scaleFactor,scaleFactor,scaleFactor);

      this.group.add( object );
      console.log('GOTIT', object);
    }, onProgress, onError );
    
    this.group = new THREE.Group();
    this.group.position.set(...options.position);
    this.options = options;

    this.place = new Planet(globals, {
      path: 'thewell',
      size: 1,
      rotationSpeed: 0,
      position: [-2,-1.5,0]
    });
    this.group.add(this.place.group);
  }

  update(timeDelta, timeElapsed) {
    this.place.group.rotation.x = (this.place.group.rotation.x + timeDelta * 0.25) % (2*Math.PI);
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