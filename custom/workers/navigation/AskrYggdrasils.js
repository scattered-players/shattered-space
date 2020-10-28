import config from 'config';
import * as THREE from 'three';
import TextureLoader from '../TextureLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import MTLLoader from '../MTLLoader';
import FBXLoader from '../FBXLoader';

export default class AskrYggdrasils {
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
    loader.setPath(`/media/3d/planets/askr/`).load( `Spacestation.fbx`, ( object ) => {
      let map = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/askr/spasestation_AM.png`),
      metallicMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/askr/spasestation_MM.png`),
      roughnessMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/askr/spasestationl_RM.png`),
      normalMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/askr/spasestation_NM.png`);

      let material = new THREE.MeshStandardMaterial({
        map,
        metallicMap,
        roughnessMap,
        normalMap,
        // transparent: true,
        // opacity: 0.25
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
      object.position.set(0.035,0,-0.015);
      let scaleFactor = 0.0001;
      object.scale.set(scaleFactor,scaleFactor,scaleFactor);

      console.log('GOTIT', object);
    }, onProgress, onError );

    this.group = new THREE.Group();
    this.group.position.set(...options.position);


    // let redSphere = new THREE.Mesh(globals.sphereGeometry, new THREE.MeshBasicMaterial({color:0xff0000}));
    // redSphere.scale.set(0.01,0.01,0.01);
    // this.group.add(redSphere);

    // let blueSphere = new THREE.Mesh(globals.sphereGeometry, new THREE.MeshBasicMaterial({color:0x0000ff}));
    // blueSphere.scale.set(0.01,0.01,0.01);
    // blueSphere.position.set(0.1,0,0);
    // this.group.add(blueSphere);

    // let greenSphere = new THREE.Mesh(globals.sphereGeometry, new THREE.MeshBasicMaterial({color:0x00ff00}));
    // greenSphere.scale.set(0.01,0.01,0.01);
    // greenSphere.position.set(0,0,0.1);
    // this.group.add(greenSphere);
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