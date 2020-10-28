import * as THREE from 'three';
import config from 'config';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';

import MTLLoader from '../MTLLoader';
import FBXLoader from '../FBXLoader';
import TextureLoader from '../TextureLoader';
import CubeTextureLoader from '../CubeTextureLoader';

import {
  ShipA,
  ShipB,
  ShipC,
  ShipD,
  ShipE,
  ShipF
} from './ships';
import Ansible from './Ansible';

import vertexShader from '../../glsl/ai-vertex.glsl';
import aiFragmentShader from '../../glsl/ai-frag.glsl';

let SHIP_DICT = {
  'Grígori Ektelestís Metaforás': ShipA,
  'IAS Temerity': ShipB,
  'Phantasm': ShipC,
  'Mothers’ Little Worker b.e.e.': ShipD,
  'Ǝ𝝰𝛺-𝟡𝖝': ShipE,
  'The Dowager Sovereign, Roxanne IV': ShipF
}

export default class AIScene {
  constructor(canvas, width, height, dpi, sendToMainThread) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.dpi = dpi;
    this.sendToMainThread = sendToMainThread;
    this.state = null;

    this.render = this.render.bind(this);
    this.setDistortion = this.setDistortion.bind(this);
    
    this.initScene();
  }
  
  initScene() {
    this.blendshapes = {
      browDownLeft: 0,
      browDownRight: 0,
      browInnerUp: 0,
      browOuterUpLeft: 0,
      browOuterUpRight: 0,
      cheekPuff: 0,
      cheekSquintLeft: 0,
      cheekSquintRight: 0,
      eyeBlinkLeft: 0,
      eyeBlinkRight: 0,
      eyeLookDownLeft: 0,
      eyeLookDownRight: 0,
      eyeLookInLeft: 0,
      eyeLookInRight: 0,
      eyeLookOutLeft: 0,
      eyeLookOutRight: 0,
      eyeLookUpLeft: 0,
      eyeLookUpRight: 0,
      eyeSquintLeft: 0,
      eyeSquintRight: 0,
      eyeWideLeft: 0,
      eyeWideRight: 0,
      jawForward: 0,
      jawLeft: 0,
      jawOpen: 0,
      jawRight: 0,
      mouthClose: 0,
      mouthDimpleLeft: 0,
      mouthDimpleRight: 0,
      mouthFrownLeft: 0,
      mouthFrownRight: 0,
      mouthFunnel: 0,
      mouthLeft: 0,
      mouthLowerDownLeft: 0,
      mouthLowerDownRight: 0,
      mouthPressLeft: 0,
      mouthPressRight: 0,
      mouthPucker: 0,
      mouthRight: 0,
      mouthRollLower: 0,
      mouthRollUpper: 0,
      mouthShrugLower: 0,
      mouthShrugUpper: 0,
      mouthSmileLeft: 0,
      mouthSmileRight: 0,
      mouthStretchLeft: 0,
      mouthStretchRight: 0,
      mouthUpperUpLeft: 0,
      mouthUpperUpRight: 0,
      noseSneerLeft: 0,
      noseSneerRight: 0,
      tongueOut: 0
    };
    this.disposables = [];
    var fontLoader = new THREE.FontLoader();
    fontLoader.load( `${config.ASSET_ROOT}/fonts/helvetiker_regular.typeface.json`, ( font ) => {
      this.font = font;
    });

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
    this.camera.position.set(-5,2,0);
    this.camera.lookAt(0,1,0);
    this.cameraGroup = new THREE.Group();

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(this.ambientLight);

    // this.pointLight = new THREE.PointLight(0xffffff, 1, 10);
    // this.pointLight.position.set( 0, 2, 0);
    // this.bigGroup.add(this.pointLight);

    this.shipLights = [0,1,2,3,4,5,6,7,8,9,10,11].map((hmm, i) => {
      let colorArg = i%2 === 1 ? 0xffffff : `hsl(${360*i/12},80%,50%)`
      console.log('COLOR', colorArg)
      let shipLight = new THREE.PointLight(colorArg, 1, 10);
      this.bigGroup.add(shipLight);
      let angle = (2*Math.PI)*i/12;
      shipLight.position.set(
        20*Math.cos(angle),
        2,
        20*Math.sin(angle)
      )
      return shipLight
    })

    // this.spinLight = new THREE.PointLight(0xffffff, 2, 1);
    // this.bigGroup.add(this.spinLight);

    // this.spinLight2 = new THREE.PointLight(0xffffff, 2, 1);
    // this.bigGroup.add(this.spinLight2);
    // var sphereSize = 0.1;
    // this.spinLightHelper = new THREE.PointLightHelper( this.spinLight, sphereSize );
    // this.bigGroup.add( this.spinLightHelper );

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

    this.manager = new THREE.LoadingManager();
    this.manager.addHandler( /\.tga$/i, new TGALoader() );

    var onProgress = function ( xhr ) {
      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
      }
    };
    this.loader = new FBXLoader();
		this.loader.load( `/media/3d/planets/skavo/spacestation.fbx`, ( object ) => {
      var skavoMaterial = new THREE.MeshPhysicalMaterial( {
        // color: 0x0055ff,
        envMap: this.scene.background,
        envMapIntensity: 0.75,
        metalness: 0.99,
        roughness: 0.5,
        reflectivity: 1.0,
      })
      this.scene.background.mapping = THREE.CubeReflectionMapping;
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
      object.rotation.z = Math.PI/2;
      object.position.set(0,-5,0);
      let scaleFactor = 0.5;
      object.scale.set(scaleFactor,scaleFactor,scaleFactor);
      this.station = object;
      this.bigGroup.add( object );
      console.log('GOTIT', object);

      // this.bigGroup.add(hangar);

      setTimeout(() =>{
        this.clock = new THREE.Clock(true);
        this.rAF = requestAnimationFrame(this.render);
        this.setDistortion();
      }, 1000);

    }, onProgress , e => console.log('UHOH', e));

    
    // let sphereMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00
    // });
    // let sphere1 = new THREE.Mesh(new THREE.SphereBufferGeometry(1,64,64), sphereMaterial);
    // sphere1.scale.set(0.05, 0.05, 0.05);
    // this.cameraGroup.add(sphere1);

    // let sphereMaterial2 = new THREE.MeshBasicMaterial({
    //   color: 0xff0000
    // });
    // let sphere2 = new THREE.Mesh(new THREE.SphereBufferGeometry(1,64,64), sphereMaterial2);
    // sphere2.scale.set(0.05, 0.05, 0.05);
    // sphere2.position.set(1,0,0)
    // this.cameraGroup.add(sphere2);

    // let sphereMaterial3 = new THREE.MeshBasicMaterial({
    //   color: 0x0000ff
    // });
    // let sphere3 = new THREE.Mesh(new THREE.SphereBufferGeometry(1,64,64), sphereMaterial3);
    // sphere3.scale.set(0.05, 0.05, 0.05);
    // sphere3.position.set(0,0,1)
    // this.cameraGroup.add(sphere3);


    this.dummyCamera = new THREE.OrthographicCamera();
    this.dummyScene = new THREE.Scene();
    this.disposables.push(this.dummyScene);
    this.dummyGeometry = new THREE.BufferGeometry();
    this.disposables.push(this.dummyGeometry);
    // Triangle expressed in clip space coordinates
    const vertices = new Float32Array([
      -1.0, 4.0,
      -1.0, -1.0,
      4.0, -1.0,
    ]);
    this.dummyGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 2));

    this.faceResolution = new THREE.Vector2(1200,1600);
    this.renderer.getDrawingBufferSize(this.faceResolution);
    this.aiTarget = new THREE.WebGLRenderTarget(this.faceResolution.x, this.faceResolution.y, {
      // format: THREE.RGBFormat,
      stencilBuffer: false,
      depthBuffer: true,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    });
    this.disposables.push(this.aiTarget);

    // this.faceScaleFactor = new Vector2().fromArray(resolution.x / resolution.y > videoWidth / videoHeight
    //   ? [videoWidth * (resolution.y / videoHeight), resolution.y]
    //   : [resolution.x, videoHeight * (resolution.x / videoWidth)]);

    this.aiHelmetTexture = new TextureLoader().load(`/media/3d/ai/ai-helmet.png`);
    this.aiMouthTexture = new TextureLoader().load(`/media/3d/ai/ai-mouth.png`);
    this.aiLeftEyeTexture = new TextureLoader().load(`/media/3d/ai/ai-lefteye.png`);
    this.aiRightEyeTexture = new TextureLoader().load(`/media/3d/ai/ai-righteye.png`);
    // this.aiHelmetTexture.repeat = new THREE.Vector2(1,1)

    this.distortAmount = { value: 1 };
    this.dummyMaterial = new THREE.RawShaderMaterial({
      fragmentShader: aiFragmentShader,
      vertexShader,
      uniforms: {
        helmetTex: {value: this.aiHelmetTexture},
        mouthTex: {value: this.aiMouthTexture},
        leftEyeTex: {value: this.aiLeftEyeTexture},
        rightEyeTex: {value: this.aiRightEyeTexture},
        mouthY: {value: 0.19},
        eyeY: { value: 0.68},
        // eyePosition: { value: new THREE.Vector2(0.22,0.68)},
        jawOpen: { value: 1 / Math.max(1.5*this.blendshapes.jawOpen,0.01) },
        eyeBlinkLeft: {value: 1 / Math.max(1.5*this.blendshapes.eyeBlinkLeft,0.01)},
        eyeBlinkRight: {value: 1 / Math.max(1.5*this.blendshapes.eyeBlinkRight,0.01)},
        time: { value: 0 },
        distortAmount: this.distortAmount
      },
      // transparent: true,
    });
    this.disposables.push(this.dummyMaterial);
    this.triangle = new THREE.Mesh(this.dummyGeometry, this.dummyMaterial);
    // Our triangle will be always on screen, so avoid frustum culling checking
    this.triangle.frustumCulled = false;
    this.dummyScene.add(this.triangle);

    this.planeGeometry = new THREE.PlaneBufferGeometry(6,9, 6,9);
    this.disposables.push(this.planeGeometry);
    this.aiMaterial = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      map: this.aiTarget.texture,
      emissive: 0xffffff,
      emissiveIntensity: 10,
      emissiveMap: this.aiTarget.texture,
      clearcoat: 1.0,
      clearcoatRoughness: 0.5,
      transparency: 0.1
    });
    this.disposables.push(this.aiMaterial);
    this.aiFace = new THREE.Mesh(this.planeGeometry, this.aiMaterial);
    this.aiFace.matrixAutoUpdate = false;
    this.aiGroup = new THREE.Group();
    this.aiGroup.add(this.aiFace);
    this.aiGroup.scale.set(0.4,0.4,0.4);
    this.aiGroup.position.set(0,1.5,10);
    this.cameraGroup.add(this.camera);
    // this.aiGroup.rotateY(Math.PI/2);
    this.cameraGroup.add(this.aiGroup);
    this.bigGroup.add(this.cameraGroup)
    this.anchor = (new THREE.Matrix4()).setPosition(0,0,-15);
    this.needsFaceUpdate = true;

    let shipClasses = [
      ShipB,
      ShipB,
      ShipC,
      ShipD,
      ShipE,
      ShipF
    ];
    this.shipGroups = [];
    this.ships = [];
    this.items = [];
    this.itemGeometry = new THREE.BoxBufferGeometry(1,1,1);
    this.disposables.push(this.itemGeometry);
    this.itemTexture = new TextureLoader().load(`/media/3d/crate.gif`);
    this.disposables.push(this.itemTexture);
    this.itemMaterial = new THREE.MeshPhysicalMaterial({
      map: this.itemTexture,
      emissive: 0xffffff,
      emissiveIntensity: 0
    });
    this.disposables.push(this.itemMaterial);
    this.state = null;

    this.ansibleGroup = new THREE.Group();
    this.ansibleGroup.position.set(0,4,0);
    this.bigGroup.add(this.ansibleGroup);
    this.ansible = new Ansible(this.ansibleGroup);
  }

  setDistortion() {
    if(this.distortAmount.value === 1){
      this.aiMaterial.transparency = 0.2;
      this.distortAmount.value = 0;
      this.distortTimeout = setTimeout(this.setDistortion, Math.random()*10*1000);
    } else {
      this.distortAmount.value = 1;
      this.aiMaterial.transparency = 0.6;
      this.distortTimeout = setTimeout(this.setDistortion, 100 + Math.random()*400);
    }
  }

  updateAR(data) {
    // console.log('GOTIT', data);
    this.anchor = (new THREE.Matrix4())
      // .makeRotationY(-Math.PI / 2)
      .multiply((new THREE.Matrix4())
      .set(...data.anchor));
    let position = (new THREE.Vector3()).setFromMatrixPosition(this.anchor);
    this.anchor.setPosition(position.multiplyScalar(50));
    this.blendshapes = data.blendShapes;
    this.needsFaceUpdate = true;
    // console.log('BLINK', 100*this.blendshapes.eyeBlinkLeft)
    // console.log('SQUINT', 100*this.blendshapes.eyeSquintLeft)
  }

  updateScene(newState) {
    let oldState = this.state;
    this.state = newState;
    
    newState.ships.map(newShip => {
      let needsAdded = !oldState || !oldState.ships.some(oldShip => newShip._id === oldShip._id);
      if(needsAdded) {
        console.log('ADDING SHIP', newShip.name);
        const {
          _id: shipId,
          name
        } = newShip,
        shipAssetName = SHIP_DICT[name] ? name : 'IAS Temerity',
        ShipClass = SHIP_DICT[shipAssetName],
        shipGroup = new THREE.Group();
        this.scene.add(shipGroup);

        this.ships.push({
          shipModel: new ShipClass(shipGroup),
          shipGroup,
          shipId
        });
      }
    });
    
    oldState && oldState.ships.map(oldShip => {
      let needsRemoved = !newState.ships.some(newShip => newShip._id === oldShip._id);
      if(needsRemoved) {
        console.log('REMOVING SHIP');
        let shipToRemove = this.ships.filter(ship => ship.shipId === oldShip._id)[0];
        this.ships = this.ships.filter(ship => ship.shipId !== oldShip._id);

        this.scene.remove(shipToRemove.group);
        shipToRemove.ship.dispose();
      }
    });

    newState.items.map(newItem => {
      let needsAdded = !oldState || !oldState.items.some(oldItem => newItem._id === oldItem._id);
      if(needsAdded) {
        console.log('ADDING ITEM', newItem.name, this.items);
        const {
          _id: itemId
        } = newItem,
        itemModel = new THREE.Mesh(this.itemGeometry, this.itemMaterial),
        itemGroup = new THREE.Group();

        let origin = (newState.shipChosen > -1) ? this.ships[newState.shipChosen].shipGroup.position : new THREE.Vector3(10,0,10);
        itemGroup.position.set(
          origin.x,
          origin.y,
          origin.z
        );
        itemGroup.add(itemModel);
        this.scene.add(itemGroup);

        this.items.push({
          itemModel,
          itemGroup,
          itemId
        });
      }
    });
    
    oldState && oldState.items.map(oldItem => {
      let needsRemoved = !newState.items.some(newItem => newItem._id === oldItem._id);
      if(needsRemoved) {
        console.log('REMOVING ITEM');
        let itemToRemove = this.items.filter(item => item.itemId === oldItem._id)[0];
        this.items = this.items.filter(item => item.itemId !== oldItem._id);
        this.scene.remove(itemToRemove.itemGroup);
      }
    });
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

    if(!this.state) {
      return;
    }

    let {
      scene,
      camera,
      composer,
      renderer
    } = this;

    
    let ansibleTime = 0;
    if(this.state.isAnsibleActive){
      ansibleTime = (Date.now() - this.state.ansibleStartTime)/1000;
      this.ambientLight.intensity = Math.min(50, this.ambientLight.intensity* (1+timeDelta));
      this.itemMaterial.emissiveIntensity = Math.min(1, Math.max(0, ansibleTime/4));
      this.ansible.render(Math.max(0,ansibleTime-4));
    }

    // this.camera.position.z = 2*Math.sin(Date.now()/10000);
    // this.pointLight.position.z = 2*Math.sin(Date.now()/10000);

    // this.spinLight.position.x = 2*Math.sin(Date.now()/2000);
    // this.spinLight.position.z = 2*Math.cos(Date.now()/2000);
    // this.spinLight2.position.x = -2*Math.sin(Date.now()/2000);
    // this.spinLight2.position.z = -2*Math.cos(Date.now()/2000);

    this.aiFace.matrix = this.anchor;
    // console.log((new THREE.Vector3()).setFromMatrixPosition(this.anchor));
    // console.log(this.aiFace.position);
    // console.log('MATRIX')
    // console.log(`${Math.round(this.anchor.elements[0])}`)
    // console.log(this.aiFace.rotation)
    // this.camera.position.z += 1
    // this.camera.rotateX(timeDelta*0.9);
    // this.camera.rotateY(timeDelta*1.1);
    // this.bigGroup.rotateY(timeDelta/10);
    this.shipLights.map((shipLight, i) => {
      let angle = elapsedTime/3 + (2*Math.PI)*i/this.shipLights.length;
      shipLight.position.set(
        20*Math.cos(angle),
        2,
        20*Math.sin(angle)
      )
    });
    this.ships.map(({shipGroup}, i) => {
      let angle = (2*Math.PI)*i/this.ships.length;
      shipGroup.position.set(
        -15*Math.sin(angle),
        Math.sin(elapsedTime* (1+ i/10))*0.5 + 0.5,
        -15*Math.cos(angle)
      );
      shipGroup.rotation.y = angle;
    });

    let cameraWiggle = Math.max(0,elapsedTime-1);
    this.camera.position.x = 0.5*Math.cos(3*cameraWiggle) / Math.max(1, Math.pow(cameraWiggle/2,4));
    this.camera.position.y = 7.5 + 0.25*Math.sin(2*cameraWiggle) / Math.max(1, Math.pow(cameraWiggle/2,4));
    this.camera.position.z = 12;
    this.camera.zoom = 1 + 2*(Math.sin(2*cameraWiggle))/Math.pow(cameraWiggle,3);
    // this.station.position.y = 10*Math.cos(elapsedTime);

    let spinspeed = Math.min(1 + ansibleTime/2, 3)
    this.items.map((item, i) => {
      let targetAngle = ((elapsedTime-ansibleTime)/5 + (spinspeed*ansibleTime) + i/this.items.length) * 2 * Math.PI,
        targetPosition,
        lerpFactor;

        if(this.state.isAnsibleActive) {
          let height = Math.min(5, ansibleTime*2);
          let approach = Math.min(6, Math.max(0, 3*(ansibleTime - 1)));
          targetPosition =  new THREE.Vector3(
            (-6+approach)*Math.sin(targetAngle),
            -1 + height,
            (-6+approach)*Math.cos(targetAngle)
          )
          lerpFactor = 20;
        } else {
          targetPosition = new THREE.Vector3(
            -6*Math.sin(targetAngle),
            -1,
            -6*Math.cos(targetAngle)
          );
          lerpFactor = 2;
        }
        item.itemModel.rotateX(timeDelta*0.9);
        item.itemModel.rotateY(timeDelta*1.0);
        item.itemModel.rotateZ(timeDelta*1.1);
        item.itemGroup.position.lerp(targetPosition, timeDelta*lerpFactor);
    });
    
    this.camera.position.z = 9;
    let targetAngle, targetPosition
    if(this.state.shipChosen >= 0){
      let angle = (this.state.shipChosen / this.ships.length) * 2 * Math.PI;
      targetPosition = new THREE.Vector3(-8*Math.sin(angle),-2,-8*Math.cos(angle));
      targetAngle = (-Math.PI / 2) + angle;
    } else {
      targetPosition = new THREE.Vector3(0, 0, 0);
      targetAngle = -Math.PI / 2;
    }
    this.cameraGroup.position.lerp(targetPosition, timeDelta);
    this.cameraGroup.rotation.y += timeDelta * ((targetAngle - this.cameraGroup.rotation.y) % (2*Math.PI));
    
    this.camera.updateProjectionMatrix();
    let cameraFocusPos = new THREE.Vector3();
    this.aiFace.getWorldPosition(cameraFocusPos);
    let startRotation = new THREE.Quaternion().copy(this.camera.quaternion);

    cameraFocusPos.lerp(new THREE.Vector3(0,4,0), Math.min(1, ansibleTime/3));
    this.camera.lookAt(cameraFocusPos);
    let endRotation = new THREE.Quaternion().copy(this.camera.quaternion);
    THREE.Quaternion.slerp( startRotation, endRotation, this.camera.quaternion, Math.min(1,timeDelta));
    // this.camera.setRotationFromQuaternion(startRotation);
    // this.camera.quaternion.slerp(endRotation,1)

    // if(this.needsFaceUpdate){

    this.dummyMaterial.uniforms.time.value = elapsedTime;
    this.dummyMaterial.uniforms.jawOpen.value = 1 / Math.max(2*(1-Math.pow((1-this.blendshapes.jawOpen), 3)),0.01);
    this.dummyMaterial.uniforms.eyeBlinkLeft.value = Math.max(Math.sign(this.blendshapes.eyeBlinkLeft)*Math.pow(3*this.blendshapes.eyeBlinkLeft, 2),1);
    this.dummyMaterial.uniforms.eyeBlinkRight.value = Math.max(Math.sign(this.blendshapes.eyeBlinkRight)*Math.pow(3*this.blendshapes.eyeBlinkRight, 2) ,1);
    renderer.setRenderTarget(this.aiTarget);
    renderer.render(this.dummyScene, this.dummyCamera);
    this.needsFaceUpdate = false;
    // }
    renderer.setRenderTarget(null);
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