import config from 'config';
import * as THREE from 'three';
import TextureLoader from '../TextureLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MTLLoader from '../MTLLoader';
import FBXLoader from '../FBXLoader';
import Planet from './Planet';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';

export default class ArtemisStation {
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
      .setPath(`/media/3d/planets/artemis/` )
      .load( 'artemis_7k.mtl', materials => {

        materials.preload();
        console.log('MATERIALS', materials.materials);

        new OBJLoader( globals.loadingManager )
          .setMaterials( materials )
          .setPath(`/media/3d/planets/artemis/` )
          .load( 'artemis_7k.obj', object => {
            console.log('GOTIT', object);

            object.children.map(( child ) => {
              if ( child.isMesh ) {
                this.disposables.push(child.geometry);
                child.castShadow = true;
                child.receiveShadow = true;
              }
            } );

            // object.position.set(0,0.75,0);

            object.position.set(0,1.25,0);
            object.rotation.set(-Math.PI/2,0,0);

            let scaleFactor = 0.01;
            object.scale.set(scaleFactor,scaleFactor,scaleFactor);
            this.group.add( object );

            // console.log('EXPORTING...');
            // let startTime = Date.now();
            // var exporter = new OBJExporter();
            // var result = exporter.parse( object );
            // console.log('EXPORTED', (Date.now()-startTime)/1000);
            // globals.sendToMainThread({
            //   type:'SAVE_FILE',
            //   data: result
            // });

          }, onProgress, onError );

      }, onProgress, onError );
    this.group = new THREE.Group();
    this.group.position.set(...options.position);
    this.options = options;

    this.place = new Planet(globals, {
      path: 'luxias',
      size: 1,
      rotationSpeed: 0,
      position: [0,-0.5,0]
    });
    this.group.add(this.place.group);
    this.group.rotation.set(0.2,0,0);
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