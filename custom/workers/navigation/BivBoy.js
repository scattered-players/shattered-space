import config from 'config';
import * as THREE from 'three';
import TextureLoader from '../TextureLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MTLLoader from '../MTLLoader';

export default class BivBoy {
  constructor(globals, options) {
    this.disposables = [];
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    this.MTLLoader = new MTLLoader(globals.loadingManager)
      .setPath(`/media/3d/planets/bivboy/`)
      .load('spaceship_high_obj.mtl', materials => {

        materials.preload();
        console.log('GOT MATERIALS', materials);
        Object.keys(materials.materials).map(key => materials.materials[key] = this.getRealMaterial(materials.materials[key]))
        this.disposables.push(materials);
        // materials = materials.map(getRealMaterial);

        let objLoader = new OBJLoader(globals.loadingManager)
          .setMaterials(materials)
          .setPath(`/media/3d/planets/bivboy/`)
          .load('spaceship_1e0.obj', object => {
            object.traverse(  ( child ) => {
              if ( child.isMesh ) {
                this.disposables.push(child.geometry);
              }
            });

            let scale = 0.025;
            object.scale.set(scale,scale,scale);
            object.position.set(-0.25,-0.2,0.05);
            object.rotateX(Math.PI / 5);
            object.rotateZ(Math.PI / 9);
            this.group.add(object);

            // let sphereMaterial = new THREE.MeshBasicMaterial({
            //   color: 0x00ff00
            // });
            // let sphere1 = new THREE.Mesh(globals.sphereGeometry, sphereMaterial);
            // sphere1.scale.set(0.05, 0.05, 0.05);
            // this.group.add(sphere1);

            // let sphereMaterial2 = new THREE.MeshBasicMaterial({
            //   color: 0xff0000
            // });
            // let sphere2 = new THREE.Mesh(globals.sphereGeometry, sphereMaterial2);
            // sphere2.scale.set(0.05, 0.05, 0.05);
            // sphere2.position.set(1,0,0)
            // this.group.add(sphere2);

            // let sphereMaterial3 = new THREE.MeshBasicMaterial({
            //   color: 0x0000ff
            // });
            // let sphere3 = new THREE.Mesh(globals.sphereGeometry, sphereMaterial3);
            // sphere3.scale.set(0.05, 0.05, 0.05);
            // sphere3.position.set(0,0,1)
            // this.group.add(sphere3);
          }, onProgress, onError);
        
          this.disposables.push(objLoader);

      }, onProgress, onError);
    this.group = new THREE.Group();
    this.group.position.set(...options.position);
    this.options = options;
  }

  getRealMaterial(oldMaterial) {
    this.disposables.push(oldMaterial);
    let basename = oldMaterial.name.slice(3,-2);
    if(basename.slice(0,5) === 'tanda'){
      basename = 's' + basename;
    }
    console.log(oldMaterial.name, basename);
    let aoMap = new TextureLoader().load(`/media/3d/planets/bivboy/${basename}_ao.png`),
    map = new TextureLoader().load(`/media/3d/planets/bivboy/${basename}_basecolor.png`),
    normalMap = new TextureLoader().load(`/media/3d/planets/bivboy/${basename}_normal.png`),
    roughnessMap = new TextureLoader().load(`/media/3d/planets/bivboy/${basename}_roughness.png`),
    metalnessMap = new TextureLoader().load(`/media/3d/planets/bivboy/${basename}_metallic.png`),
    displacementMap = new TextureLoader().load(`/media/3d/planets/bivboy/${basename}_height.png`);
    this.disposables = this.disposables.concat([
      aoMap,
      map,
      normalMap,
      roughnessMap,
      metalnessMap,
      displacementMap
    ]);
    
    let offset = new THREE.Vector2(0,-0.03);
    aoMap.offset = offset;
    map.offset = offset;
    normalMap.offset = offset;
    roughnessMap.offset = offset;
    metalnessMap.offset = offset;
    displacementMap.offset = offset;
    
    let repeat = new THREE.Vector2(1,0.7);
    aoMap.repeat = repeat;
    map.repeat = repeat;
    normalMap.repeat = repeat;
    roughnessMap.repeat = repeat;
    metalnessMap.repeat = repeat;
    displacementMap.repeat = repeat;

    const newMaterial = new THREE.MeshStandardMaterial({
      name: oldMaterial.name,
      color: oldMaterial.color,
      aoMap,
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