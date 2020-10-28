import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';

import MTLLoader from '../../../../show-app/host/src/workers/MTLLoader';
import FBXLoader from '../../../../show-app/host/src/workers/FBXLoader';
import TextureLoader from '../../../../show-app/host/src/workers/TextureLoader';
import CubeTextureLoader from '../../../../show-app/host/src/workers/CubeTextureLoader';

import Ansible from './Ansible';

export default class TestScene {
  constructor(canvas, width, height, dpi, sendToMainThread) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.dpi = dpi;
    this.sendToMainThread = sendToMainThread;
    this.state = null;

    this.render = this.render.bind(this);
    
    this.initScene();
  }
  
  initScene() {
    this.disposables = [];

    this.scene = new THREE.Scene();
    this.disposables.push(this.scene);

    this.skybox = new CubeTextureLoader().setPath(`/media/3d/skybox/`).load([
      'right.png', 'left.png',
      'top.png', 'bottom.png',
      'front.png', 'back.png'
    ]);
    this.disposables.push(this.skybox);
    this.scene.background = this.skybox;

    this.bigGroup = new THREE.Group();
    this.scene.add(this.bigGroup);

    this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
    // this.camera.rotateY(Math.PI);
    this.camera.position.set(-5,2,5);
    this.camera.lookAt(0,1,0);
    this.cameraGroup = new THREE.Group();

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(this.ambientLight);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: 'high-performance',
      antialias: true,
      // alpha: true
    });
    // this.renderer.setPixelRatio(this.dpi);
    this.renderer.setSize(this.width, this.height, false);
    // this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.disposables.push(this.renderer);

    this.renderScene = new RenderPass( this.scene, this.camera );

    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.width, this.height ), 1, 0.1, 0.85 );
    this.filmPass = new FilmPass( 0.25, 0.65, 1024, false );
    this.composer = new EffectComposer( this.renderer );
    this.composer.addPass( this.renderScene );
    // this.composer.addPass( this.bloomPass );
    // this.composer.addPass( this.filmPass );
    
    let sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    let sphere1 = new THREE.Mesh(new THREE.SphereBufferGeometry(1,64,64), sphereMaterial);
    sphere1.scale.set(0.05, 0.05, 0.05);
    this.cameraGroup.add(sphere1);

    let sphereMaterial2 = new THREE.MeshBasicMaterial({
      color: 0xff0000
    });
    let sphere2 = new THREE.Mesh(new THREE.SphereBufferGeometry(1,64,64), sphereMaterial2);
    sphere2.scale.set(0.05, 0.05, 0.05);
    sphere2.position.set(1,0,0)
    this.cameraGroup.add(sphere2);

    let sphereMaterial3 = new THREE.MeshBasicMaterial({
      color: 0x0000ff
    });
    let sphere3 = new THREE.Mesh(new THREE.SphereBufferGeometry(1,64,64), sphereMaterial3);
    sphere3.scale.set(0.05, 0.05, 0.05);
    sphere3.position.set(0,0,1);
    this.cameraGroup.add(sphere3);
    
    this.ansible = new Ansible(this.scene);
    this.bigGroup.add(this.ansible);


    this.clock = new THREE.Clock(true);
    this.rAF = requestAnimationFrame(this.render);
  }

  resizeScene(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
  }

  render() {
    this.sendToMainThread({type:'RENDER'});
    this.rAF = requestAnimationFrame(this.render);
    let timeDelta = this.clock.getDelta();
    let elapsedTime = this.clock.getElapsedTime();


    let {
      scene,
      camera,
      composer,
      renderer
    } = this;

    this.ansible.render(elapsedTime);
    
    this.camera.position.set(10*Math.sin(0.5*elapsedTime),2,10*Math.cos(0.5*elapsedTime));
    this.camera.lookAt(0,0,0);

    // renderer.render( scene, camera );
    composer.render( scene, camera );
  }

  destroy() {
    cancelAnimationFrame(this.rAF);
    clearTimeout(this.distortTimeout);
    this.state = null;
    this.canvas = null;
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