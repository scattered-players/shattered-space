import seedrandom from 'seedrandom';
import * as THREE from 'three';
import config from 'config';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import CubeTextureLoader from '../CubeTextureLoader';
import TextureLoader from '../TextureLoader';

import shardVertexShader from '../../glsl/shard-vertex.glsl';
import shardFragmentShader from '../../glsl/shard-frag.glsl';
import sunFragmentShader from '../../glsl/sun-frag.glsl';
import sunVertexShader from '../../glsl/sun-vertex.glsl';

import { ShipB } from './ships';

let placeSeed = Math.random();
console.log('PLACESEED', placeSeed);
let placeRng = seedrandom(placeSeed);
const randFactor = 5;
// const PLACE_DICT = {
//   Terra: {
//     name: 'terra',
//     size: 0.5,
//     position: [
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng()))),
//       placeRng() *Math.sign(Math.pow(-1,Math.round(placeRng())))* 1,
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng())))
//     ]
//   },
//   Europa: {
//     name: 'europa',
//     size: 0.6,
//     position: [
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng()))),
//       placeRng() *Math.sign(Math.pow(-1,Math.round(placeRng())))* 1,
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng())))
//     ]
//   },
//   Neptunish: {
//     name: 'neptunish',
//     size: 1.6,
//     position: [
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng()))),
//       placeRng() *Math.sign(Math.pow(-1,Math.round(placeRng())))* 1,
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng())))
//     ]
//   },
//   Eve: {
//     name: 'eve',
//     size: 0.65,
//     position: [
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng()))),
//       placeRng() *Math.sign(Math.pow(-1,Math.round(placeRng())))* 1,
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng())))
//     ]
//   },
//   Mordor: {
//     name: 'mordor',
//     size: 0.55,
//     position: [
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng()))),
//       placeRng() *Math.sign(Math.pow(-1,Math.round(placeRng())))* 1,
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng())))
//     ]
//   },
//   Minmus: {
//     name: 'minmus',
//     size: 0.55,
//     position: [
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng()))),
//       placeRng() *Math.sign(Math.pow(-1,Math.round(placeRng())))* 1,
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng())))
//     ]
//   },
//   RedGreen: {
//     name: 'firered-leafgreen',
//     size: 0.55,
//     position: [
//       (5+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng()))),
//       placeRng() *Math.sign(Math.pow(-1,Math.round(placeRng())))* 1,
//       (10+placeRng()*randFactor) * Math.sign(Math.pow(-1,Math.round(placeRng())))
//     ]
//   }
// }
const PLACE_DICT = {
  Terra: {
    name: 'terra',
    size: 0.25,
    rotationSpeed: 0.1
  },
  Europa: {
    name: 'europa',
    size: 0.3,
    rotationSpeed: 0.1
  },
  Neptunish: {
    name: 'neptunish',
    size: 1.6,
    rotationSpeed: 0.1
  },
  Eve: {
    name: 'eve',
    size: 0.25,
    rotationSpeed: 0.1
  },
  Mordor: {
    name: 'mordor',
    size: 0.25,
    rotationSpeed: 0.1
  },
  Minmus: {
    name: 'minmus',
    size: 0.25,
    rotationSpeed: 0.1
  },
  RedGreen: {
    name: 'firered-leafgreen',
    size: 0.25,
    rotationSpeed: 0.1
  },
  HotJupiter: {
    name: 'hotjupiter',
    size: 2,
    rotationSpeed: 0.1
  },
  Somethin: {
    name: 'somethin',
    size: 0.25,
    rotationSpeed: 0.1
  },
  Ruby: {
    name: 'ruby',
    size: 0.3,
    rotationSpeed: 0.1
  }
}

function createOrbital(options) {
  const {
    parent,
    radius,
    object,
    orbitSpeed,
    startingPhase
  } = options;

  let outerGroup = new THREE.Group();
  let innerGroup = new THREE.Group();
  parent.add(outerGroup);
  outerGroup.add(innerGroup);
  innerGroup.position.x = radius;
  innerGroup.add(object);

  // var points = [];
  // const numPoints = 256;
  // for(let i = 0; i < numPoints; i++){
  //   let angle = 2*Math.PI*i/numPoints;
  //   points.push( new THREE.Vector3( radius * Math.sin(angle), 0, radius * Math.cos(angle) ) );
  // }

  // var geometry = new THREE.BufferGeometry().setFromPoints( points );
  // var material = new THREE.LineBasicMaterial( {
  //   color: 0xffffff,
  //   opacity: 0.5,
  //   transparent: true
  // } );
  // var line = new THREE.LineLoop( geometry, material );
  // outerGroup.add(line);

  return {
    outerGroup,
    innerGroup,
    startingPhase,
    orbitSpeed
  };
}

export default class IntroScreen {
  constructor(canvas, width, height, dpi, sendToMainThread) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.dpi = dpi;
    this.sendToMainThread = sendToMainThread;
    this.state = null;

    this.updateScene = this.updateScene.bind(this);
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
    // this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.001, 1000 );
    this.camera.position.z = 10;
    this.camera.position.x = 10;
    this.camera.position.y = 5;
    this.camera.lookAt(0,0,0);
    // this.scene.add(this.camera);

    // var radius = 100;
    // var radials = 36;
    // var circles = 50;
    // var divisions = 256;

    // var helper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
    // helper.material.onBeforeCompile = shader => {
    //   console.log('SHADER', shader);
    //   shader.fragmentShader = helperFragmentShader;
    //   return shader;
    // }
    // this.scene.add( helper );
    // console.log('HALPP', helper);

    // this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    // this.scene.add(this.ambientLight);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: 'high-performance',
      antialias: true
    });
    this.renderer.setPixelRatio(this.dpi*1);
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.disposables.push(this.renderer);

    this.renderScene = new RenderPass( this.scene, this.camera );

    // this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.width, this.height ), 1.5, 0.1, 0.35 );
    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.width, this.height ), 1.25, 0.1, 0.5 );
    this.composer = new EffectComposer( this.renderer );
    this.composer.addPass( this.renderScene );
    this.composer.addPass( this.bloomPass );

    this.sphereGeometry = new THREE.SphereBufferGeometry(1,64,64);
    this.disposables.push(this.sphereGeometry);

    this.shardGeometry = new THREE.BufferGeometry();
    let numTriangles = 10000;
    let triangleDim = 100;
    this.shardPositions = new Float32Array(numTriangles*3*3);
    // Good seeds:
    // 0.4109603631705345
    // 0.9447783720129754
    let seed = '0.4109603631705345';
    seed = ''+Math.random();
    console.log('SEED', seed);
    var myrng = seedrandom(seed);
    for(let i = 0; i < numTriangles; i++) {
      for(let j = 0; j < 3; j++) {
          let index = (i*3+j)*3;
          this.shardPositions[index] = triangleDim*myrng() - triangleDim/2;
          this.shardPositions[index+1] = triangleDim*myrng() - triangleDim/2;
          this.shardPositions[index+2] = triangleDim*myrng() - triangleDim/2;
      }
    }
    this.shardGeometry.addAttribute('position', new THREE.BufferAttribute(this.shardPositions, 3));
    this.shardMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        intensity: { value: 0 }
      },
      vertexShader: shardVertexShader,
      fragmentShader: shardFragmentShader,
      transparent: true
    });
    this.shards = new THREE.Mesh(this.shardGeometry, this.shardMaterial);
    this.scene.add(this.shards);
    
    this.places = [];
    this.clock = new THREE.Clock(true);
    this.rAF = requestAnimationFrame(this.render);

    // this.sunMaterial = new THREE.MeshStandardMaterial({
    //   emissive: 0xffffff,
    //   emissiveIntensity: 2
    // })

    // this.sunMaterial = new THREE.ShaderMaterial({
    //   uniforms: {
    //     time: { value: 0}
    //   },
    //   fragmentShader: sunFragmentShader,
    //   vertexShader: sunVertexShader
    // })

    this.timeUniform = { value: 0};

    // this.disposables.push(this.sunMaterial);
    // this.sunGroup = new THREE.Group();
    // this.sunGroup.position.z = -10;
    // this.sunGroup.position.x = -10;
    // this.orbitalRoot = new THREE.Group();
    
    // this.orbitalRoot.position.z = 0;
    // this.orbitalRoot.position.x = 0;
    // this.scene.add(this.orbitalRoot);
    // this.orbitals = [0,1].map(i => {
    //   let group = new THREE.Group();
    //   let material = new THREE.ShaderMaterial({
    //       uniforms: {
    //         time: this.timeUniform,
    //         bias: { value: 0.5*Math.pow(-1,i)}
    //       },
    //       fragmentShader: sunFragmentShader,
    //       vertexShader: sunVertexShader
    //     })
    //   let surface = new THREE.Mesh(this.sphereGeometry, material);
    //   // surface.position.set(3*Math.pow(-1,i), 0, 0);
    //   surface.scale.set(2.5,2.5,2.5);
    //   group.add(surface);

    //   let sunLight = new THREE.PointLight(0xffffff,1);
    //   // sunLight.position.set(3*Math.pow(-1,i), 0, 0);
    //   group.add(sunLight);

    //   return createOrbital({
    //     parent: this.orbitalRoot,
    //     radius: 3*Math.pow(-1,i),
    //     orbitSpeed: 5,
    //     startingPhase: -Math.PI*2/5,
    //     object: group
    //   })
    // });


    // let eve = this.createPlace('Eve');
    // this.innermostOrbit = createOrbital({
    //   parent: this.orbitalRoot,
    //   object: eve,
    //   // object: THREE.Group(),
    //   radius: 7,
    //   orbitSpeed: 1,
    //   startingPhase: -Math.PI/5
    // })
    // this.orbitals.push(this.innermostOrbit);
    // // this.camera.position.z = 0.25;
    // // this.camera.position.x = 0.25;
    // // this.camera.position.y = 0;
    // // this.innermostOrbit.innerGroup.add(this.camera);

    // let sister1 = this.createPlace('Terra');
    // let sister2 = this.createPlace('RedGreen');
    // let sisterRoot = createOrbital({
    //   parent: this.orbitalRoot,
    //   object: new THREE.Group(),
    //   radius: 15,
    //   orbitSpeed: 1,
    //   startingPhase: -Math.PI
    // })
    // this.orbitals.push(sisterRoot);
    // let sister1Orbital = createOrbital({
    //   parent: sisterRoot.innerGroup,
    //   object: sister1,
    //   radius: 0.6,
    //   orbitSpeed: 5,
    //   startingPhase: 0
    // });
    // this.orbitals.push(sister1Orbital);
    // this.orbitals.push(createOrbital({
    //   parent: sisterRoot.innerGroup,
    //   object: sister2,
    //   radius: 0.6,
    //   orbitSpeed: 5,
    //   startingPhase: Math.PI
    // }));

    // let neptunish = this.createPlace('Neptunish');
    // let europa = this.createPlace('Europa');
    // let minmus = this.createPlace('Minmus');
    // let nepOrbit = createOrbital({
    //   parent: this.orbitalRoot,
    //   object: neptunish,
    //   radius: 20,
    //   orbitSpeed: 1,
    //   startingPhase: -Math.PI/2
    // });
    // this.orbitals.push(nepOrbit);
    // this.orbitals.push(createOrbital({
    //   parent: nepOrbit.innerGroup,
    //   object: europa,
    //   radius: 2.8,
    //   orbitSpeed: 3,
    //   startingPhase: 0
    // }))
    // this.orbitals.push(createOrbital({
    //   parent: nepOrbit.innerGroup,
    //   object: minmus,
    //   radius: 3.8,
    //   orbitSpeed: 4,
    //   startingPhase: 0
    // }));

    // this.cameraStops = [
    //   {
    //     place: sister2,
    //     radius: 1
    //   },
    //   {
    //     place: minmus,
    //     radius: 0.5
    //   },
    // ];


    // nepOrbit.innerGroup.add(this.camera);
    this.scene.add(this.camera);
    // this.camera.position.z = 2;
    // this.camera.rotateY(-Math.PI*1/2)



    this.ship = new ShipB(this.scene);
    this.disposables.push(this.ship);
    for (let i = 0; i < 10; i++){
      let newLight = new THREE.PointLight(0xffffff,1);
      newLight.position.set(40*Math.random()-10,40*Math.random()-10,40*Math.random()-10);
      this.scene.add(newLight);
    }

    // this.scene.add(this.sunGroup);
    // this.updateScene({
    //   places: Object.keys(PLACE_DICT).map(placeName => ({
    //     _id: Math.random(),
    //     placeName
    //   }))
    // });
  }


  createPlace(placeName) {
    const placeAssetName = PLACE_DICT[placeName] ? placeName : 'Terra',
    props = PLACE_DICT[placeAssetName],
    diffuseTexture = new TextureLoader().load(`/media/3d/${props.name}/diffuse.png`),
    emissionTexture = new TextureLoader().load(`/media/3d/${props.name}/emission.png`),
    normalTexture = new TextureLoader().load(`/media/3d/${props.name}/normal.png`),
    specularTexture = new TextureLoader().load(`/media/3d/${props.name}/specular.png`),
    surfaceMaterial = new THREE.MeshPhysicalMaterial({
      clearcoat: 1.0,
      clearcoatRoughness: 0.8,
      map: diffuseTexture,
      emissive: 0xffffff,
      emissiveMap: emissionTexture,
      emissiveIntensity: 1,
      normalMap: normalTexture,
      normalMapType: THREE.ObjectSpaceNormalMap,
      specularMap: specularTexture
    }),
    surface = new THREE.Mesh(this.sphereGeometry, surfaceMaterial),
    cloudsTexture = new TextureLoader().load(`/media/3d/${props.name}/clouds.png`),
    cloudsMaterial = new THREE.MeshPhysicalMaterial({
      map: cloudsTexture,
      transparency: 0.3,
      alphaMap: cloudsTexture,
      alphaTest: 0.5
    }),
    clouds = new THREE.Mesh(this.sphereGeometry, cloudsMaterial),
    group = new THREE.Group();

    surface.scale.set(props.size,props.size,props.size);
    group.add(surface);
    clouds.scale.set(1.01*props.size,1.01*props.size,1.01*props.size);
    group.add(clouds);

    this.places.push({
      group,
      props
    });
    return group;
  }

  updateScene(newState) {
    let oldState = this.state;
    this.state = newState;
    
    // newState.places.map(newPlace => {
    //   let needsAdded = !oldState || !oldState.places.some(oldPlace => newPlace._id === oldPlace._id);
    //   if(needsAdded) {
    //     const {
    //         _id: placeId,
    //         placeName
    //       } = newPlace,
    //       placeAssetName = PLACE_DICT[placeName] ? placeName : 'Terra',
    //       props = PLACE_DICT[placeAssetName],
    //       diffuseTexture = new TextureLoader().load(`/media/3d/${placeAssetName.toLowerCase()}/diffuse.png`),
    //       emissionTexture = new TextureLoader().load(`/media/3d/${placeAssetName.toLowerCase()}/emission.png`),
    //       normalTexture = new TextureLoader().load(`/media/3d/${placeAssetName.toLowerCase()}/normal.png`),
    //       specularTexture = new TextureLoader().load(`/media/3d/${placeAssetName.toLowerCase()}/specular.png`),
    //       surfaceMaterial = new THREE.MeshPhysicalMaterial({
    //         map: diffuseTexture,
    //         // emissive: 0xffffff,
    //         emissiveMap: emissionTexture,
    //         emissiveIntensity: 1,
    //         // normalMap: normalTexture,
    //         // normalMapType: THREE.ObjectSpaceNormalMap,
    //         specularMap: specularTexture
    //       }),
    //       surface = new THREE.Mesh(this.sphereGeometry, surfaceMaterial),
    //       cloudsTexture = new TextureLoader().load(`/media/3d/${placeAssetName.toLowerCase()}/clouds.png`),
    //       cloudsMaterial = new THREE.MeshPhysicalMaterial({
    //         map: cloudsTexture,
    //         alphaMap: cloudsTexture,
    //         alphaTest: 0.5
    //       }),
    //       clouds = new THREE.Mesh(this.sphereGeometry, cloudsMaterial),
    //       group = new THREE.Group();

    //     surface.scale.set(props.size,props.size,props.size);
    //     group.add(surface);
    //     clouds.scale.set(1.05*props.size,1.05*props.size,1.05*props.size);
    //     group.add(clouds);
    //     group.position.set(...props.position);
    //     this.scene.add(group);

    //     this.places.push({
    //       placeId,
    //       placeName,
    //       props,
    //       diffuseTexture,
    //       // emissionTexture,
    //       // normalTexture,
    //       // specularTexture,
    //       surfaceMaterial,
    //       surface,
    //       cloudsTexture,
    //       cloudsMaterial,
    //       clouds,
    //       group
    //     });
    //   }
    // });
    
    // oldState && oldState.places.map(oldPlace => {
    //   let needsRemoved = !newState.places.some(newPlace => newPlace._id === oldPlace._id);
    //   if(needsRemoved) {
    //     let placeToRemove = this.places.filter(place => place._id === oldPlace._id)[0];
    //     this.places = this.places.filter(place => place._id !== oldPlace._id);

    //     this.scene.remove(placeToRemove.group);
    //     placeToRemove.diffuseTexture.dispose();
    //     placeToRemove.emissionTexture.dispose();
    //     placeToRemove.normalTexture.dispose();
    //     placeToRemove.specularTexture.dispose();
    //     placeToRemove.surfaceMaterial.dispose();
    //     placeToRemove.cloudsTexture.dispose();
    //     placeToRemove.cloudsMaterial.dispose();
    //   }
    // });

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
    // this.rAF = requestAnimationFrame(() => this.rAF = requestAnimationFrame(this.render));
    this.rAF = requestAnimationFrame(this.render);
    let timeDelta = this.clock.getDelta();
    let elapsedTime = this.clock.getElapsedTime();

    if(!this.state) {
      return;
    }

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
      composer,
      renderer
    } = this;


    // if(this.ship.mesh){
    //   // this.ship.mesh.rotation.y += timeDelta/2;
    //   this.ship.mesh.rotation.z += timeDelta/2;
    // }

    // this.camera.position.z = -20*Math.sin(elapsedTime/30);
    // this.camera.position.x = -20*Math.cos(elapsedTime/30);
    // this.camera.position.set(3,4,10*Math.sin(elapsedTime/10)+5);
    // this.innermostOrbit.innerGroup.rotateY(timeDelta/10);
    // this.camera.lookAt(0,0,0);

    // camera.rotation.y = (Math.PI*1/2) - 3.5*elapsedTime/10;
    places.map(place => {
      place.group.rotation.y += timeDelta * place.props.rotationSpeed;
      place.group.rotation.x = 0;
    })

    // this.orbitals.map(orbital => {
    //   orbital.outerGroup.rotation.y = orbital.startingPhase + orbital.orbitSpeed*elapsedTime/10;
    // })

    // this.shardMaterial.uniforms.intensity.value = Math.min(100, Math.pow(Math.max(0,elapsedTime-10)/7,2));
    // this.sunMaterial.uniforms.intensity.value = Math.min(100, Math.pow(elapsedTime/10,2));
    this.timeUniform.value = elapsedTime;
    // let placePosition = this.cameraStops[0].place.position;
    // let targetPosition = new THREE.Vector3().copy(placePosition);
    let cameraOrbitRadius = 150;//this.cameraStops[0].radius;
    let now = (elapsedTime / 100);
    this.camera.position.x = Math.sin(now) * cameraOrbitRadius;
    this.camera.position.z = Math.cos(now) * cameraOrbitRadius;
    this.camera.lookAt(0,0,0);
    // let nextPosition = camera.position.lerp(targetPosition, Math.min(1,timeDelta));
    // camera.position.set(nextPosition.x, nextPosition.y, nextPosition.z);
    // camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
    // cameraLight.position.set(nextPosition.x, nextPosition.y, nextPosition.z);

    // let startRotation = new THREE.Quaternion().copy( camera.quaternion );
    // camera.lookAt(this.cameraStops[0].place.getWorldPosition(new THREE.Vector3()));
    // camera.setRotationFromQuaternion( startRotation.slerp(camera.quaternion, Math.min(1,5*timeDelta)));
    
    // renderer.render( scene, camera );
    composer.render( scene, camera );
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