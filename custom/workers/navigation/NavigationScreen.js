import * as THREE from 'three';
import CubeTextureLoader from '../CubeTextureLoader';
import TextureLoader from '../TextureLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import AfterimagePass from '../AfterimagePass';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import PLANET_DICT from './planets';

THREE.Cache.enabled = true;

export default class NavigationScreen {
  constructor(sendToMainThread) {
    this.state = null;

    this.sendToMainThread = sendToMainThread.bind(this);
    this.rotatePlace = this.rotatePlace.bind(this);
    this.updateScene = this.updateScene.bind(this);
    this.render = this.render.bind(this);

    this.initScene();
  }
  
  initScene() {
    this.disposables = [];

    this.scene = new THREE.Scene();
    this.disposables.push(this.scene);

    let startTime = Date.now();
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.addHandler( /\.tga$/i, new TGALoader(this.loadingManager) );
    this.loadingManager.onLoad = () => {
      setTimeout(() => {
        console.log('LOADED!', (Date.now()-startTime)/1000, this.hasReceivedFirstUpdate );
        if(this.hasReceivedFirstUpdate) {
          this.hasReceivedFirstLoad = true;
        }
      }, 1000);
    };

    this.skybox = new CubeTextureLoader(this.loadingManager).setPath(`/media/3d/skybox/`).load([
      'right.png', 'left.png',
      'top.png', 'bottom.png',
      'front.png', 'back.png'
    ]);
    this.disposables.push(this.skybox);
    this.scene.background = this.skybox;
    
    this.envMap = new CubeTextureLoader(this.loadingManager).setPath(`/media/3d/skybox/`).load([
      'right.png', 'left.png',
      'top.png', 'bottom.png',
      'front.png', 'back.png'
    ]);
    this.envMap.mapping = THREE.CubeReflectionMapping;
    this.disposables.push(this.envMap);

    this.camera = new THREE.PerspectiveCamera( 75, 4/3, 0.001, 1000 );

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight();
    this.scene.add(this.directionalLight);
    this.directionalLight.target.position.set(0,0,1000);
    this.scene.add(this.directionalLight.target)

    // this.cameraLight = new THREE.PointLight(0xffffff, 1);
    // this.scene.add(this.cameraLight);

    this.sphereGeometry = new THREE.SphereBufferGeometry(1,64,64);
    this.disposables.push(this.sphereGeometry);
    
    this.places = [];
    
    this.hasReceivedFirstUpdate = false;
    this.hasReceivedFirstLoad = false;
    this.frameTimes = [];

    // this.updateScene({
    //   places: Object.keys(PLANET_DICT).map(assetKey => ({
    //     _id: Math.random(),
    //     assetKey
    //   }))
    // });
    // this.selectedPlaceIndex = -1;
    // this.rotatePlaceTimeout = setTimeout(this.rotatePlace, 5 * 1000);
  }

  initRenderer(canvas, width, height, dpi) {
    this.destroyRenderer();

    console.log('INIT RENDERER', canvas, width, height, dpi);
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.dpi = dpi;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(this.dpi);
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;

    this.composer = new EffectComposer( this.renderer );

    this.renderScene = new RenderPass( this.scene, this.camera );
    this.composer.addPass( this.renderScene );
    
    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.width, this.height ), 1.5, 0.4, 0.85 );
    this.composer.addPass( this.bloomPass );
    
    this.afterImage = new AfterimagePass(0, width, height);
    this.composer.addPass(this.afterImage);
    
    this.clock = new THREE.Clock(true);
    this.rAF = requestAnimationFrame(this.render);
  }

  destroyRenderer() {
    cancelAnimationFrame(this.rAF);
    this.canvas = null;
    this.width = null;
    this.height = null;
    this.dpi = null;
    if(this.renderer){
      this.renderer.dispose();
    }
    this.renderer = null;
    this.renderScene = null;
    if(this.bloomPass){
      this.bloomPass.dispose();
    }
    this.bloomPass = null;
    this.afterImage = null;
    this.composer = null;
  }

  rotatePlace() {
    if(this.state){
      console.log('SELECTING', this.places);
      this.selectedPlaceIndex++;
      if(this.selectedPlaceIndex >= this.state.places.length) {
        this.selectedPlaceIndex = 0;
      }
      this.state.selectedPlace = this.state.places[this.selectedPlaceIndex];
    } else {
      console.log('NO STATE', this);
    }
    this.rotatePlaceTimeout = setTimeout(this.rotatePlace, 5 * 1000);
  }

  updateScene(newState) {
    let oldState = this.state;
    this.state = newState;
    console.log('NEW STATE', this);
    
    newState.places.map(newPlace => {
      let needsAdded = !oldState || !oldState.places.some(oldPlace => newPlace._id === oldPlace._id);
      if(needsAdded) {
        console.log('ADDING PLACE', newPlace.assetKey);
        const {
          _id: placeId,
          assetKey
        } = newPlace,
        placeAssetName = PLANET_DICT[assetKey] ? assetKey : 'Terra',
        globals = {
          scene: this.scene,
          sphereGeometry: this.sphereGeometry,
          envMap: this.envMap,
          loadingManager: this.loadingManager,
          sendToMainThread: this.sendToMainThread
        },
        metadata = {
          placeId,
          assetKey
        };

        this.places.push(PLANET_DICT[placeAssetName](globals, metadata));
      }
    });
    
    oldState && oldState.places.map(oldPlace => {
      let needsRemoved = !newState.places.some(newPlace => newPlace._id === oldPlace._id);
      if(needsRemoved) {
        console.log('REMOVING PLACE');
        let placeToRemove = this.places.filter(place => place.metadata.placeId === oldPlace._id)[0];
        this.places = this.places.filter(place => place.metadata.placeId !== oldPlace._id);

        this.scene.remove(placeToRemove.group);
        placeToRemove.dispose();
      }
    });
    
    this.hasReceivedFirstUpdate = true;
  }

  resizeScene(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer && this.renderer.setSize(width, height, false);
    this.composer && this.composer.setSize(width, height);
    this.afterImage && this.afterImage.setSize(width, height);
    this.bloomPass && this.bloomPass.setSize(width, height);
  }

  render() {
    this.sendToMainThread({type:'RENDER'});
    this.rAF = requestAnimationFrame(this.render);
    let timeDelta = this.clock.getDelta();
    let timeElapsed = this.clock.getElapsedTime();
    // console.log('RENDER?', !!this.state, !!this.hasReceivedFirstLoad, !!this.renderer)

    if(!this.state || !this.hasReceivedFirstLoad || !this.renderer) {
      return;
    }
    this.frameTimes.push(timeDelta);

    let {
      state: {
        places: statePlaces,
        myParty,
        selectedPlace,
        isInTransit
      },
      places,
      scene,
      camera,
      cameraLight,
      composer,
      renderer
    } = this;

    let postTargets = {
      afterImageDamping: 0,
      bloomStrength: 1.5, 
      bloomRadius: 0.4, 
      bloomThreshold: 0.85
    };
    if (selectedPlace) {
      let matchingPlaceObjects = places.filter(placeObject => placeObject.metadata.placeId === selectedPlace._id);
      if (matchingPlaceObjects.length) {
        let placeObject = matchingPlaceObjects[0];
        if(placeObject.metadata.assetKey === 'CosmicRapids') {
          postTargets = {
            afterImageDamping: 0.97,
            bloomStrength: 5,
            bloomRadius: 0.5, 
            bloomThreshold: 0.15
          };
        }
        let placePosition = new THREE.Vector3(...placeObject.cameraFocus)
        let targetPosition = new THREE.Vector3().copy(placePosition);
        // let cameraOrbitRadius = isInTransit ? 1 : 5;
        let cameraOrbitRadius = placeObject.cameraOrbitRadius;
        let now = Date.now() / (3 * 1000);
        targetPosition.x += Math.sin(now) * cameraOrbitRadius;
        targetPosition.y += 1;
        targetPosition.z += Math.cos(now) * cameraOrbitRadius;
        let nextPosition = camera.position.lerp(targetPosition, Math.min(1, 5*timeDelta));
        camera.position.set(nextPosition.x, nextPosition.y, nextPosition.z);
        // cameraLight.position.set(nextPosition.x, nextPosition.y, nextPosition.z);

        let startRotation = new THREE.Quaternion().copy( camera.quaternion );
        camera.lookAt( placePosition );
        camera.setRotationFromQuaternion( startRotation.slerp(camera.quaternion, Math.min(1,10*timeDelta)));
      }
    }

    let currentAfterimageDamping = this.afterImage.uniforms.damp.value;
    this.afterImage.uniforms.damp.value = currentAfterimageDamping + (postTargets.afterImageDamping - currentAfterimageDamping)*(2*timeDelta);

    let currentBloomStrength = this.bloomPass.strength;
    this.bloomPass.strength = currentBloomStrength + (postTargets.bloomStrength - currentBloomStrength)*(2*timeDelta);

    let currentBloomRadius = this.bloomPass.radius;
    this.bloomPass.radius = currentBloomRadius + (postTargets.bloomRadius - currentBloomRadius)*(2*timeDelta);

    let currentBloomThreshold = this.bloomPass.threshold;
    this.bloomPass.threshold = currentBloomThreshold + (postTargets.bloomThreshold - currentBloomThreshold)*(2*timeDelta);

    places.map(place => {
      place.update(timeDelta, timeElapsed, !!selectedPlace && place.metadata.placeId === selectedPlace._id);
    })

    let targetFov = isInTransit ? 170 : 50;
    camera.fov += (targetFov-camera.fov)*Math.min(1,timeDelta);
    camera.updateProjectionMatrix();

    // renderer.render( scene, camera );
    composer.render( scene, camera );
    // console.log('RENDER!', this.canvas)
  }

  destroy() {
    cancelAnimationFrame(this.rAF);
    clearTimeout(this.rotatePlaceTimeout);
    this.state = null;
    this.canvas = null;
    this.places.map(placeToRemove => {
      this.scene.remove(placeToRemove.group);
      placeToRemove.dispose();
    });
    this.disposables.map(asset => {
      try {
        asset.dispose();
      } catch (e){
        console.error('DISPOSAL ERROR', asset);
        console.error(e);
      }
    });

    if(this.frameTimes.length){
      let avgFrameTime = this.frameTimes.reduce((sum, frameTime) => sum+frameTime, 0) / this.frameTimes.length;
      let fps = 1/avgFrameTime;
      console.log('AVERAGE FPS', fps, this.frameTimes);
    }
  }
}