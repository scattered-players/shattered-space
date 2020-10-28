
import * as THREE from 'three';
import config from 'config';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TextureLoader from '../TextureLoader';
import MTLLoader from '../MTLLoader';
import FBXLoader from '../FBXLoader';
import { Vector2 } from 'three';

class Ship {
  constructor(scene) {
    this.disposables = [];
    this.init(scene);
  }

  dispose() {
    this.disposables.map(asset => {
      try {
        asset.dispose();
      } catch (e) {
        console.error('DISPOSAL ERROR', asset);
        console.error(e);
      }
    });
  }
}

export class ShipA extends Ship {
  init(scene) {
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');

      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    var manager = new THREE.LoadingManager();

    // comment in the following line and import TGALoader if your asset uses TGA textures
    // manager.addHandler( /\.tga$/i, new TGALoader() );

    // new MTLLoader(manager)
    //   .setPath(`/media/3d/ships/e/`)
    //   .load('ship.mtl', materials => {

    //     materials.preload();
    //     console.log('GOT MATERIALS', materials);
    //     // Object.keys(materials.materials).map(key => materials.materials[key] = getRealMaterial(materials.materials[key]))

    //     function getRealMaterial(oldMaterial){
    //       console.log(oldMaterial.name);
    //       const newMaterial = new THREE.MeshPhysicalMaterial({
    //         name: oldMaterial.name,
    //         color: oldMaterial.color,
    //         emissive: oldMaterial.emissive,
    //         specular: oldMaterial.specular,
    //         normalMap: oldMaterial.normalMap,
    //         normalMapType: THREE.ObjectSpaceNormalMap,
    //         map: oldMaterial.map,
    //         emissiveMap: oldMaterial.emissiveMap

    //       });
    //       return newMaterial;
    //     }

    //     new OBJLoader(manager)
    //       .setMaterials(materials)
    //       .setPath(`/media/3d/ships/e/`)
    //       .load('ship.obj', object => {
    //         console.log('GOT OBJECT', object);
    //         // object.children.map(mesh => {
    //         //   console.log(mesh.name);
    //         //   if(mesh.name === 'Canopy_Cube.000') {
    //         //     console.log(mesh);
    //         //     object.remove(mesh);
    //         //     mesh = new THREE.Mesh(mesh.geometry, mesh.material);
    //         //     object.add(mesh);
    //         //   }
    //         // })

    //         object.children[0].geometry.groups = object.children[0].geometry.groups.slice(0,3);

    //         let scaleFactor = 2;
    //         object.scale.set(scaleFactor,scaleFactor,scaleFactor)
    //         scene.add(object);
    //         this.mesh = object;
    //       }, onProgress, onError);

    //   }, onProgress, onError);

      // var loader = new FBXLoader();
      // loader.load( `/media/3d/ships/a/Carbine_Arrow_0.5.fbx`, ( object ) => {
      //   let color = 'GreenBlack'
      //   // let normalMap = new TextureLoader().load(`/media/3d/ships/f/Textures/Common-textures/Starship_Normal_OpenGL.png`);
      //   // let material = new THREE.MeshPhysicalMaterial({
      //   //   clearcoat:1.0,
      //   //   clearcoatNormalMap: normalMap,
      //   //   metalnessMap: new TextureLoader().load(`/media/3d/ships/f/Textures/Common-textures/Starship_Metallic.png`),
      //   //   roughnessMap: new TextureLoader().load(`/media/3d/ships/f/Textures/Common-textures/Starship_Roughness.png`),
      //   //   aoMap: new TextureLoader().load(`/media/3d/ships/f/Textures/Common-textures/Starship_Mixed_AO.png`),
      //   //   normalMap,
      //   //   map: new TextureLoader().load(`/media/3d/ships/f/Textures/Colors/${color}/Starship_Base_Color.png`),
      //   //   emissiveMap: new TextureLoader().load(`/media/3d/ships/f/Textures/Colors/${color}/Starship_Emissive.png`),
      //   // });

      //   object.traverse( function ( child ) {
      //     if ( child.isMesh ) {
      //       // child.material = material;
      //       child.castShadow = true
      //       child.receiveShadow = true;
      //     }
      //   } );
      //   console.log(object.scale);
      //   let scaleFactor = 1;
      //   object.scale.set(scaleFactor,scaleFactor,scaleFactor)

      //   scene.add( object );
      //   this.mesh = object;
      //   console.log('GOTIT', object);

      // }, onProgress, onError );
      var loader = new GLTFLoader().setPath( `/media/3d/ships/a/` );
						loader.load( 'Carbine_Arrow_0.5.glb', function ( gltf ) {
							gltf.scene.traverse( function ( child ) {

								if ( child.isMesh ) {

									// roughnessMipmapper.generateMipmaps( child.material );

								}

							} );

							scene.add( gltf.scene );

							// roughnessMipmapper.dispose();

							// render();

						} );
  }
}

export class ShipB extends Ship {
  init(scene) {
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');

      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    var manager = new THREE.LoadingManager();

    // comment in the following line and import TGALoader if your asset uses TGA textures
    // manager.addHandler( /\.tga$/i, new TGALoader() );

    new MTLLoader(manager)
      .setPath(`/media/3d/ships/b/`)
      .load('Fighter.mtl', materials => {

        materials.preload();
        console.log('GOT MATERIALS', materials);
        Object.keys(materials.materials).map(key => materials.materials[key] = getRealMaterial(materials.materials[key]))

        function getRealMaterial(oldMaterial){
          console.log(oldMaterial.name);
          const newMaterial = new THREE.MeshPhysicalMaterial({
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            name: oldMaterial.name,
            color: oldMaterial.color,
            emissive: oldMaterial.emissive,
            specular: oldMaterial.specular,
            shininess: oldMaterial.shininess

          });
          return newMaterial;
        }

        new OBJLoader(manager)
          .setMaterials(materials)
          .setPath(`/media/3d/ships/b/`)
          .load('Fighter.obj', object => {
            scene.add(object);
            this.mesh = object;
          }, onProgress, onError);

      }, onProgress, onError);
  }
}

export class ShipC extends Ship {
  init(scene) {
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');

      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    var manager = new THREE.LoadingManager();

    // comment in the following line and import TGALoader if your asset uses TGA textures
    // manager.addHandler( /\.tga$/i, new TGALoader() );

    new MTLLoader(manager)
      .setPath(`/media/3d/ships/c/`)
      .load('Spaceship.mtl', materials => {

        materials.preload();
        console.log('GOT MATERIALS', materials);
        Object.keys(materials.materials).map(key => materials.materials[key] = getRealMaterial(materials.materials[key]))

        function getRealMaterial(oldMaterial){
          console.log(oldMaterial.name);
          const newMaterial = new THREE.MeshPhysicalMaterial({
            side: THREE.DoubleSide,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            name: oldMaterial.name,
            color: oldMaterial.color,
            emissive: oldMaterial.emissive,
            specular: oldMaterial.specular,
            shininess: oldMaterial.shininess
          });
          return newMaterial;
        }

        new OBJLoader(manager)
          .setMaterials(materials)
          .setPath(`/media/3d/ships/c/`)
          .load('Spaceship.obj', object => {
            console.log('GOT OBJECT', object);
            object.children = object.children.filter(child => child.name.indexOf('Cube') === -1)
            scene.add(object);
            this.mesh = object;
          }, onProgress, onError);

      }, onProgress, onError);
  }
}

export class ShipD extends Ship {
  init(scene) {
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');

      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    var manager = new THREE.LoadingManager();

    // comment in the following line and import TGALoader if your asset uses TGA textures
    // manager.addHandler( /\.tga$/i, new TGALoader() );

    new MTLLoader(manager)
      .setPath(`/media/3d/ships/d/`)
      .load('Spaceship1.mtl', materials => {

        materials.preload();
        console.log('GOT MATERIALS', materials);
        Object.keys(materials.materials).map(key => materials.materials[key] = getRealMaterial(materials.materials[key]))

        function getRealMaterial(oldMaterial){
          console.log(oldMaterial.name);
          const newMaterial = new THREE.MeshPhysicalMaterial({
            name: oldMaterial.name,
            color: oldMaterial.color,
            emissive: oldMaterial.emissive,
            specular: oldMaterial.specular,
            normalMap: oldMaterial.normalMap,
            normalMapType: THREE.ObjectSpaceNormalMap,
            map: oldMaterial.map,
            emissiveMap: oldMaterial.emissiveMap

          });
          return newMaterial;
        }

        new OBJLoader(manager)
          .setMaterials(materials)
          .setPath(`/media/3d/ships/d/`)
          .load('Spaceship1.obj', object => {
            console.log('GOT OBJECT', object);
            object.children.map(mesh => {
              console.log(mesh.name);
              if(mesh.name === 'Canopy_Cube.000') {
                console.log(mesh);
                object.remove(mesh);
                mesh = new THREE.Mesh(mesh.geometry, mesh.material);
                mesh.material.color = new THREE.Color(0xaaaaff)
                object.add(mesh);
              }
            })

            let scaleFactor = 0.5;
            object.scale.set(scaleFactor,scaleFactor,scaleFactor)
            scene.add(object);
            this.mesh = object;
          }, onProgress, onError);

      }, onProgress, onError);

      // var loader = new FBXLoader();
      // loader.load( `/media/3d/ships/d/Spaceship.fbx`, ( object ) => {

      //   object.traverse( function ( child ) {

      //     if ( child.isMesh ) {

      //       child.castShadow = true;
      //       child.receiveShadow = true;

      //     }

      //   } );
      //   let scaleFactor = 0.001;
      //   object.scale.set(scaleFactor,scaleFactor,scaleFactor)

      //   scene.add( object );
      //   this.mesh = object;
      //   console.log('GOTIT', object);

      // }, onProgress, onError );
  }
}

export class ShipE extends Ship {
  init(scene) {
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');

      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    var manager = new THREE.LoadingManager();

    // comment in the following line and import TGALoader if your asset uses TGA textures
    // manager.addHandler( /\.tga$/i, new TGALoader() );

    new MTLLoader(manager)
      .setPath(`/media/3d/ships/e/`)
      .load('ship.mtl', materials => {

        materials.preload();
        console.log('GOT MATERIALS', materials);
        // Object.keys(materials.materials).map(key => materials.materials[key] = getRealMaterial(materials.materials[key]))

        function getRealMaterial(oldMaterial){
          console.log(oldMaterial.name);
          const newMaterial = new THREE.MeshPhysicalMaterial({
            name: oldMaterial.name,
            color: oldMaterial.color,
            emissive: oldMaterial.emissive,
            specular: oldMaterial.specular,
            normalMap: oldMaterial.normalMap,
            normalMapType: THREE.ObjectSpaceNormalMap,
            map: oldMaterial.map,
            emissiveMap: oldMaterial.emissiveMap

          });
          return newMaterial;
        }

        new OBJLoader(manager)
          .setMaterials(materials)
          .setPath(`/media/3d/ships/e/`)
          .load('ship.obj', object => {
            console.log('GOT OBJECT', object);
            // object.children.map(mesh => {
            //   console.log(mesh.name);
            //   if(mesh.name === 'Canopy_Cube.000') {
            //     console.log(mesh);
            //     object.remove(mesh);
            //     mesh = new THREE.Mesh(mesh.geometry, mesh.material);
            //     object.add(mesh);
            //   }
            // })

            object.children[0].geometry.groups = object.children[0].geometry.groups.slice(0,3);

            let scaleFactor = 2;
            object.scale.set(scaleFactor,scaleFactor,scaleFactor)
            scene.add(object);
            this.mesh = object;
          }, onProgress, onError);

      }, onProgress, onError);

      // var loader = new FBXLoader();
      // loader.load( `/media/3d/ships/d/Spaceship.fbx`, ( object ) => {

      //   object.traverse( function ( child ) {

      //     if ( child.isMesh ) {

      //       child.castShadow = true;
      //       child.receiveShadow = true;

      //     }

      //   } );
      //   let scaleFactor = 0.001;
      //   object.scale.set(scaleFactor,scaleFactor,scaleFactor)

      //   scene.add( object );
      //   this.mesh = object;
      //   console.log('GOTIT', object);

      // }, onProgress, onError );
  }
}

export class ShipF extends Ship {
  init(scene) {
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');

      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    var manager = new THREE.LoadingManager();

    // comment in the following line and import TGALoader if your asset uses TGA textures
    // manager.addHandler( /\.tga$/i, new TGALoader() );

    // new MTLLoader(manager)
    //   .setPath(`/media/3d/ships/e/`)
    //   .load('ship.mtl', materials => {

    //     materials.preload();
    //     console.log('GOT MATERIALS', materials);
    //     // Object.keys(materials.materials).map(key => materials.materials[key] = getRealMaterial(materials.materials[key]))

    //     function getRealMaterial(oldMaterial){
    //       console.log(oldMaterial.name);
    //       const newMaterial = new THREE.MeshPhysicalMaterial({
    //         name: oldMaterial.name,
    //         color: oldMaterial.color,
    //         emissive: oldMaterial.emissive,
    //         specular: oldMaterial.specular,
    //         normalMap: oldMaterial.normalMap,
    //         normalMapType: THREE.ObjectSpaceNormalMap,
    //         map: oldMaterial.map,
    //         emissiveMap: oldMaterial.emissiveMap

    //       });
    //       return newMaterial;
    //     }

    //     new OBJLoader(manager)
    //       .setMaterials(materials)
    //       .setPath(`/media/3d/ships/e/`)
    //       .load('ship.obj', object => {
    //         console.log('GOT OBJECT', object);
    //         // object.children.map(mesh => {
    //         //   console.log(mesh.name);
    //         //   if(mesh.name === 'Canopy_Cube.000') {
    //         //     console.log(mesh);
    //         //     object.remove(mesh);
    //         //     mesh = new THREE.Mesh(mesh.geometry, mesh.material);
    //         //     object.add(mesh);
    //         //   }
    //         // })

    //         object.children[0].geometry.groups = object.children[0].geometry.groups.slice(0,3);

    //         let scaleFactor = 2;
    //         object.scale.set(scaleFactor,scaleFactor,scaleFactor)
    //         scene.add(object);
    //         this.mesh = object;
    //       }, onProgress, onError);

    //   }, onProgress, onError);

      var loader = new FBXLoader();
      loader.load( `/media/3d/ships/f/Spaceship.fbx`, ( object ) => {
        let color = 'GreenBlack'
        let normalMap = new TextureLoader().load(`/media/3d/ships/f/Textures/Common-textures/Starship_Normal_OpenGL.png`);
        let material = new THREE.MeshPhysicalMaterial({
          clearcoat:1.0,
          clearcoatNormalMap: normalMap,
          metalnessMap: new TextureLoader().load(`/media/3d/ships/f/Textures/Common-textures/Starship_Metallic.png`),
          roughnessMap: new TextureLoader().load(`/media/3d/ships/f/Textures/Common-textures/Starship_Roughness.png`),
          aoMap: new TextureLoader().load(`/media/3d/ships/f/Textures/Common-textures/Starship_Mixed_AO.png`),
          normalMap,
          map: new TextureLoader().load(`/media/3d/ships/f/Textures/Colors/${color}/Starship_Base_Color.png`),
          emissiveMap: new TextureLoader().load(`/media/3d/ships/f/Textures/Colors/${color}/Starship_Emissive.png`),
        });

        object.traverse( function ( child ) {
          if ( child.isMesh ) {
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        } );
        console.log(object.scale);
        let scaleFactor = 0.01;
        object.scale.set(scaleFactor,scaleFactor,scaleFactor)

        scene.add( object );
        this.mesh = object;
        console.log('GOTIT', object);

      }, onProgress, onError );
  }
}

export class ShipG extends Ship {
  init(scene) {
    var onProgress = function (xhr) {

      if (xhr.lengthComputable) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');

      }

    };

    var onError = function (e) { console.error('UHOH', e)};

    var manager = new THREE.LoadingManager();

    // comment in the following line and import TGALoader if your asset uses TGA textures
    // manager.addHandler( /\.tga$/i, new TGALoader() );

    new MTLLoader(manager)
      .setPath(`/media/3d/ships/g/`)
      .load('spaceship_high_obj.mtl', materials => {

        materials.preload();
        console.log('GOT MATERIALS', materials);
        Object.keys(materials.materials).map(key => materials.materials[key] = getRealMaterial(materials.materials[key]))
        // materials = materials.map(getRealMaterial);

        function getRealMaterial(oldMaterial){
          let basename = oldMaterial.name.slice(3,-2);
          console.log(oldMaterial.name, basename);
          let aoMap = new TextureLoader().load(`/media/3d/ships/g/${basename}_ao.png`),
          map = new TextureLoader().load(`/media/3d/ships/g/${basename}_basecolor.png`),
          normalMap = new TextureLoader().load(`/media/3d/ships/g/${basename}_normal.png`),
          roughnessMap = new TextureLoader().load(`/media/3d/ships/g/${basename}_roughness.png`),
          metalnessMap = new TextureLoader().load(`/media/3d/ships/g/${basename}_metallic.png`),
          displacementMap = new TextureLoader().load(`/media/3d/ships/g/${basename}_height.png`);
          
          let offset = new Vector2(0,-0.03);
          aoMap.offset = offset;
          map.offset = offset;
          normalMap.offset = offset;
          roughnessMap.offset = offset;
          metalnessMap.offset = offset;
          displacementMap.offset = offset;
          
          let repeat = new Vector2(1,0.7);
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
          return newMaterial;
        }

        new OBJLoader(manager)
          .setMaterials(materials)
          .setPath(`/media/3d/ships/g/`)
          .load('spaceship_high_obj.obj', object => {
            object.position.set(-10,0,5)
            scene.add(object);
            this.mesh = object;
          }, onProgress, onError);

      }, onProgress, onError);

      // var loader = new FBXLoader();
      // loader.load( `/media/3d/ships/g/spaceship_high_fbx.fbx`, function ( object ) {

      //   object.traverse( function ( child ) {

      //     if ( child.isMesh ) {

      //       child.castShadow = true;
      //       child.receiveShadow = true;

      //     }

      //   } );

      //   scene.add( object );

      // }, onProgress );
  }
}