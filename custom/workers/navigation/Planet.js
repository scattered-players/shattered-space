import config from 'config';
import * as THREE from 'three';
import TextureLoader from '../TextureLoader';

export default class Place {
  constructor(globals, options) {
    this.disposables = [];
    this.diffuseTexture = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/${options.path}/diffuse.png`);
    this.disposables.push(this.diffuseTexture);
    this.emissionTexture = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/${options.path}/emission.png`);
    this.disposables.push(this.emissionTexture);
    this.normalTexture = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/${options.path}/normal.png`);
    this.disposables.push(this.normalTexture);
    this.specularTexture = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/${options.path}/specular.png`);
    this.disposables.push(this.specularTexture);
    this.surfaceMaterial = new THREE.MeshStandardMaterial({
      map: this.diffuseTexture,
      emissive: 0xffffff,
      emissiveMap: this.emissionTexture,
      emissiveIntensity: 1,
      normalMap: this.normalTexture,
      normalMapType: THREE.ObjectSpaceNormalMap,
      specularMap: this.specularTexture
    });
    this.disposables.push(this.surfaceMaterial);
    this.surface = new THREE.Mesh(globals.sphereGeometry, this.surfaceMaterial);
    this.cloudsTexture = new TextureLoader(globals.loadingManager).load(`/media/3d/planets/${options.path}/clouds.png`);
    this.disposables.push(this.cloudsTexture);
    this.cloudsMaterial = new THREE.MeshStandardMaterial({
      map: this.cloudsTexture,
      alphaMap: this.cloudsTexture,
      transparent: true
    });
    this.disposables.push(this.cloudsMaterial);
    this.clouds = new THREE.Mesh(globals.sphereGeometry, this.cloudsMaterial);
    this.group = new THREE.Group();

    this.surface.scale.set(options.size,options.size,options.size);
    this.group.add(this.surface);
    this.clouds.scale.set(1.02*options.size,1.02*options.size,1.02*options.size);
    this.group.add(this.clouds);
    this.group.position.set(...options.position);
    this.options = options;
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