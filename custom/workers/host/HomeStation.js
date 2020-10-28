import * as THREE from 'three';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import FBXLoader from '../FBXLoader';

export default class HomeStation {
  constructor() {
    this.disposables = [];
    var onProgress = function (xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
    };

    var onError = function (e) { console.error('UHOH', e)};

    this.manager = new THREE.LoadingManager();

    // comment in the following line and import TGALoader if your asset uses TGA textures
    this.manager.addHandler( /\.tga$/i, new TGALoader() );

    var loader = new FBXLoader(this.manager);
    loader.setPath(`/media/3d/planets/skavo/`).load( `spacestation.fbx`, ( object ) => {
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