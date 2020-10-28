import * as THREE from 'three';
import config from 'config';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import CubeTextureLoader from '../CubeTextureLoader';
import TextureLoader from '../TextureLoader';

import { ShipA } from './ships';

export default class UghScreen {
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

    this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.001, 1000 );
    this.camera.position.z = 10;
    this.camera.position.x = 10;
    this.camera.position.y = 5;
    this.camera.lookAt(0,0,0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: 'high-performance',
      antialias: true
    });
    this.renderer.setPixelRatio(this.dpi*1);
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.disposables.push(this.renderer);

    this.ship = new ShipA(this.scene);
    this.disposables.push(this.ship);
    for (let i = 0; i < 10; i++){
      let newLight = new THREE.PointLight(0xffffff,1);
      newLight.position.set(40*Math.random()-10,40*Math.random()-10,40*Math.random()-10);
      this.scene.add(newLight);
    }
    this.clock = new THREE.Clock(true);
    this.rAF = requestAnimationFrame(this.render);
  }

  render(){
    console.log('HMM')
    this.sendToMainThread({type:'RENDER'});
    this.rAF = requestAnimationFrame(this.render);
    
    let timeDelta = this.clock.getDelta();
    let elapsedTime = this.clock.getElapsedTime();
    let cameraOrbitRadius = 50;//this.cameraStops[0].radius;
    let now = (elapsedTime / 10);
    this.camera.position.x = Math.sin(now) * cameraOrbitRadius;
    this.camera.position.z = Math.cos(now) * cameraOrbitRadius;
    this.camera.lookAt(0,0,0);

    this.renderer.render( this.scene, this.camera );
  }

  destroy() {
    cancelAnimationFrame(this.rAF);
    this.state = null;
    this.canvas = null;
    // this.suns = null;
    // this.places.map(placeToRemove => {
    //   this.scene.remove(placeToRemove.group);
    //   placeToRemove.diffuseTexture.dispose();
    //   // placeToRemove.emissionTexture.dispose();
    //   // placeToRemove.normalTexture.dispose();
    //   // placeToRemove.specularTexture.dispose();
    //   placeToRemove.surfaceMaterial.dispose();
    //   placeToRemove.cloudsTexture.dispose();
    //   placeToRemove.cloudsMaterial.dispose();
    // })
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