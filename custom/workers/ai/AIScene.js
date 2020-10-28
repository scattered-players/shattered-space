import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';

import FBXLoader from '../FBXLoader';
import TextureLoader from '../TextureLoader';
import CubeTextureLoader from '../CubeTextureLoader';

import vertexShader from '../../glsl/ai-vertex.glsl';
import aiFragmentShader from '../../glsl/ai-frag.glsl';

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
    this.camera.rotateY(Math.PI);
    this.camera.position.z = 1.5;
    this.bigGroup.add(this.camera);

    // this.ambientLight = new THREE.AmbientLight(0xffffff, 10);
    // this.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight(0xffffff, 4, 10);
    // this.pointLight.position.z = 1;
    this.bigGroup.add(this.pointLight);

    this.spinLight = new THREE.PointLight(0xffffff, 10, 1);
    this.bigGroup.add(this.spinLight);

    this.spinLight2 = new THREE.PointLight(0xffffff, 10, 1);
    this.bigGroup.add(this.spinLight2);
    // var sphereSize = 0.1;
    // this.spinLightHelper = new THREE.PointLightHelper( this.spinLight, sphereSize );
    // this.bigGroup.add( this.spinLightHelper );

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: 'high-performance',
      antialias: true,
      // alpha: true
    });
    this.renderer.setPixelRatio(this.dpi);
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // this.renderer.toneMappingExposure =1;
    // this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.disposables.push(this.renderer);

    this.renderScene = new RenderPass( this.scene, this.camera );

    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.width, this.height ), 1.45, 0.1, 0.5 );
    this.filmPass = new FilmPass( 0.25, 0.65, 1024, false );
    this.composer = new EffectComposer( this.renderer );
    this.composer.addPass( this.renderScene );
    this.composer.addPass( this.bloomPass );
    this.composer.addPass( this.filmPass );

    this.manager = new THREE.LoadingManager();
    this.manager.addHandler( /\.tga$/i, new TGALoader() );

    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

      }
    };
    this.loader = new FBXLoader();
		this.loader.load( `/media/3d/spaceport/Hangar-C5.FBX`, ( object ) => {
          console.log('OOHYEAH', object)

          let door = null
					object.traverse( function ( child ) {
            if(child.name === 'Hangar-C5_Door'){
              door = child;
            }

						if ( child.isMesh ) {

							child.castShadow = true;
							child.receiveShadow = true;

						}

          } );
          object.remove(door);

          let hangar = object.children[0];

          let oldMaterial = hangar.material;
          let newMaterial = new THREE.MeshPhysicalMaterial({
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            bumpScale: 0.66,
            color: new THREE.Color(0.847,0.847,0.847),
            emissive: new THREE.Color(0.847,0.847,0.847),
            emissiveIntensity:10,
            emissiveMap: oldMaterial.emissiveMap,
            map: oldMaterial.map,
            normalMap: oldMaterial.normalMap,
            normalScale: oldMaterial.normalScale,
            refractionRatio: 0.98, 
            shininess: 8,
            specular: oldMaterial.specular,
          });
          hangar.material = newMaterial;
          
          let scaleFactor = 0.001;
          hangar.scale.set(scaleFactor, scaleFactor, scaleFactor);

          this.bigGroup.add(hangar);

          setTimeout(() =>{
            this.clock = new THREE.Clock(true);
            this.rAF = requestAnimationFrame(this.render);
            this.setDistortion();
          }, 1000);

				}, onProgress , e => console.log('UHOH', e));
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
      transparency: 0.9
    });
    this.disposables.push(this.aiMaterial);
    this.aiFace = new THREE.Mesh(this.planeGeometry, this.aiMaterial);
    this.aiFace.matrixAutoUpdate = false;
    this.aiGroup = new THREE.Group();
    this.aiGroup.add(this.aiFace);
    this.aiGroup.scale.set(0.1,0.1,0.1);
    this.aiGroup.position.z = 1.25;
    this.aiGroup.rotateY(Math.PI);
    this.bigGroup.add(this.aiGroup);
    this.anchor = (new THREE.Matrix4()).setPosition(0,0,-15);
    this.needsFaceUpdate = true;
    
    this.places = [];
    // this.clock = new THREE.Clock(true);
    // this.rAF = requestAnimationFrame(this.render);
  }

  setDistortion() {
    if(this.distortAmount.value === 1){
      this.aiMaterial.transparency = 0.8;
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
      // .makeRotationZ(-Math.PI / 2)
      .multiply((new THREE.Matrix4())
      .set(...data.anchor));
    let position = (new THREE.Vector3()).setFromMatrixPosition(this.anchor);
    this.anchor.setPosition(position.multiplyScalar(50));
    this.blendshapes = data.blendShapes;
    this.needsFaceUpdate = true;
    // console.log('BLINK', 100*this.blendshapes.eyeBlinkLeft)
    // console.log('SQUINT', 100*this.blendshapes.eyeSquintLeft)
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

    // if(!this.state) {
    //   return;
    // }

    let {
      places,
      scene,
      camera,
      composer,
      renderer
    } = this;

    // this.camera.position.z = 2*Math.sin(Date.now()/10000);
    // this.pointLight.position.z = 2*Math.sin(Date.now()/10000);

    this.spinLight.position.x = 1.5;
    this.spinLight.position.z = 3.5*Math.cos(Date.now()/2000);
    this.spinLight2.position.x = -1.5;
    this.spinLight2.position.z = -3.5*Math.cos(Date.now()/2000);

    this.aiFace.matrix = this.anchor;
    // console.log((new THREE.Vector3()).setFromMatrixPosition(this.anchor));
    // console.log(this.aiFace.position);
    // console.log('MATRIX')
    // console.log(`${Math.round(this.anchor.elements[0])}`)
    // console.log(this.aiFace.rotation)
    // this.camera.position.z += 1
    // this.camera.rotateX(timeDelta*0.9);
    // this.camera.rotateY(timeDelta*1.1);
    this.bigGroup.rotateY(timeDelta/10);

    let cameraWiggle = Math.max(0,elapsedTime-1);
    this.camera.position.x = 0.5*Math.cos(3*cameraWiggle) / Math.max(1, Math.pow(cameraWiggle/2,4));
    this.camera.position.y = 0.25*Math.sin(2*cameraWiggle) / Math.max(1, Math.pow(cameraWiggle/2,4));
    this.camera.zoom = 1 + 2*(Math.sin(2*cameraWiggle))/Math.pow(cameraWiggle,3);
    this.camera.updateProjectionMatrix();

    let aiPos = new THREE.Vector3();
    this.aiFace.getWorldPosition(aiPos);
    let startRotation = new THREE.Quaternion().copy(this.camera.quaternion);
    this.camera.lookAt(aiPos);
    let endRotation = new THREE.Quaternion().copy(this.camera.quaternion);
    THREE.Quaternion.slerp( startRotation, endRotation, this.camera.quaternion, Math.min(1,timeDelta));
    // this.camera.setRotationFromQuaternion(startRotation);
    // this.camera.quaternion.slerp(endRotation,1)

    // if(this.needsFaceUpdate){

      this.dummyMaterial.uniforms.time.value = elapsedTime;
      this.dummyMaterial.uniforms.jawOpen.value = 1 / Math.max(2*(1-Math.pow((1-this.blendshapes.jawOpen), 4)),0.01);
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