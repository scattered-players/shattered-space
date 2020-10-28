import * as THREE from 'three';
import TextureLoader from '../TextureLoader';
import FBXLoader from '../FBXLoader';

export default class Krashcan {
  constructor(globals, options) {
    this.options = options;
    this.globals = globals;

    this.disposables = [];
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    var loader = new FBXLoader(globals.loadingManager);
    loader.setPath(`/media/3d/planets/krashcan/`).load( `N1C1H_opt.fbx`, ( object ) => {
      let map = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/krashcan/hIP1/N1C1H_blinn1_BaseColor.jpg`),
      metallicMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/krashcan/hIP1/N1C1H_blinn1_Metallic.jpg`),
      roughnessMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/krashcan/hIP1/N1C1H_blinn1_Roughness.jpg`),
      normalMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/krashcan/hIP1/N1C1H_blinn1_Normal.jpg`);

      let material = new THREE.MeshStandardMaterial({
        map,
        metallicMap,
        roughnessMap,
        normalMap
      });

      object.traverse(( child ) => {
        if ( child.isMesh ) {
          console.log('MESH', child); 
          this.disposables.push(child.geometry);
          child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      } );
      this.group.add( object );
      console.log(object.scale);
      object.position.set(0,0,0);
      let scaleFactor = 0.15;
      object.scale.set(scaleFactor,scaleFactor,scaleFactor);

      console.log('GOTIT', object);
    }, onProgress, onError );

    this.group = new THREE.Group();
    this.group.position.set(...options.position);
  }

  update(timeDelta, timeElapsed) {
  }

  dispose() {
    this.globals = null;
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