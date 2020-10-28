import config from 'config';
import * as THREE from 'three';
import TextureLoader from '../TextureLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import MTLLoader from '../MTLLoader';
import FBXLoader from '../FBXLoader';

export default class TLW {
  constructor(globals, options) {
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
    loader.setPath(`/media/3d/planets/TLW/`).load( `fighter_low.fbx`, ( object ) => {
      object.traverse(( child ) => {
        if ( child.isMesh ) {
          console.log('MESH', child); 
          this.disposables.push(child.geometry);
          child.material = child.material.map(material => this.getRealMaterial(globals, material));
          child.castShadow = true;
          child.receiveShadow = true;
        }
      } );
      console.log(object.scale);
      object.position.set(0,0,0);
      let scaleFactor = 0.001;
      object.scale.set(scaleFactor,scaleFactor,scaleFactor);

      this.group.add( object );
      console.log('GOTIT', object);
    }, onProgress, onError );
    
    this.group = new THREE.Group();
    this.group.position.set(...options.position);
    this.options = options;
  }

  getRealMaterial(globals, oldMaterial) {
    this.disposables.push(oldMaterial);
    let basename = oldMaterial.name;
    console.log(oldMaterial.name, basename);
    let map = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/TLW/text_set/fighter_low_${basename}_BaseColor.jpg`),
    normalMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/TLW/text_set/fighter_low_${basename}_Normal.jpg`),
    roughnessMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/TLW/text_set/fighter_low_${basename}_Roughness.jpg`),
    metalnessMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/TLW/text_set/fighter_low_${basename}_Metallic.jpg`),
    displacementMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/TLW/text_set/fighter_low_${basename}_Height.jpg`);
    this.disposables = this.disposables.concat([
      map,
      normalMap,
      roughnessMap,
      metalnessMap,
      displacementMap
    ]);

    const newMaterial = new THREE.MeshStandardMaterial({
      name: oldMaterial.name,
      // color: oldMaterial.color,
      map,
      normalMap,
      roughnessMap,
      metalnessMap,
      // displacementMap
    });
    this.disposables.push(newMaterial);
    return newMaterial;
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