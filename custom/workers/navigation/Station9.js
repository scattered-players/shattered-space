import config from 'config';
import * as THREE from 'three';
import TextureLoader from '../TextureLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import MTLLoader from '../MTLLoader';
import FBXLoader from '../FBXLoader';

export default class Station9 {
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
    loader.setPath(`/media/3d/planets/station9/`).load( `Models/SpaceStation.fbx`, ( object ) => {
      let normalMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/station9/Textures/Station_normals.jpg`),
        specularMap = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/station9/Textures/Station_spec.jpg`),
        map = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/station9/Textures/Station_diffuse.jpg`);
        let material = new THREE.MeshPhongMaterial({
          specularMap,
          normalMap,
          map
        });
      this.disposables = this.disposables.concat([
        normalMap,
        specularMap,
        map,
        material
      ]);

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
      object.position.set(0,-6.4,-0.01);
      let scaleFactor = 0.0004;
      object.scale.set(scaleFactor,scaleFactor,scaleFactor);

      console.log('GOTIT', object);
    }, onProgress, onError );

    var bannerGeometry = new THREE.CylinderGeometry( Math.PI/15, Math.PI/15, 0.25, 64, 1, true );
    var bannerTexture = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/station9/banner.png`);
    var bannerAlphaTexture = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/station9/banner-alpha.png`);

    var bannerMaterial = new THREE.MeshLambertMaterial( {
      side: THREE.DoubleSide,
      map: bannerTexture,
      alphaMap: bannerAlphaTexture,
      transparent: true
    } );
    this.disposables.push(bannerGeometry);
    this.disposables.push(bannerMaterial);
    this.banner = new THREE.Mesh( bannerGeometry, bannerMaterial );
    this.banner.position.set(0,0,0);
    this.banner.rotateX(Math.PI);
    
    this.group = new THREE.Group();
    this.group.rotateX(Math.PI);
    this.group.add(this.banner);
    this.group.position.set(...options.position);
  }

  update(timeDelta, timeElapsed) {
    let y = ((Math.sin(timeElapsed/2)+1)/2)* -0.25 + 0.25
    this.banner.position.set(0, y, 0);
    this.banner.rotateY(timeDelta/2);
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