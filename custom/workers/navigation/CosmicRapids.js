import * as THREE from 'three';

export default class CosmicRapids {
  constructor(globals, options) {
    this.disposables = [];
    
    this.group = new THREE.Group();
    this.group.position.set(...options.position);
    this.options = options;


    this.geometry = new THREE.BufferGeometry();
    this.disposables.push(this.geometry);
    
    let positions = [];
    let colors = [];

    let color = new THREE.Color();

    const numPoints = 50000, R = 5;
    for(let i=0; i < numPoints; i++) {

      // positions
      // var r = (1-Math.pow(Math.random(),2)) *  R;
      // var theta = Math.random() * Math.PI;
      // var phi = Math.random() * 2 * Math.PI;

      // let x = r * Math.sin(theta) * Math.cos(phi);
      // let y = r * Math.sin(theta) * Math.sin(phi);
      // let z = r * Math.cos(theta);
      
      let u = Math.random();
      let v = Math.random();
      let theta = u * 2.0 * Math.PI;
      let phi = Math.acos(2.0 * v - 1.0);
      let r = Math.cbrt(Math.random()) * R;
      let sinTheta = Math.sin(theta);
      let cosTheta = Math.cos(theta);
      let sinPhi = Math.sin(phi);
      let cosPhi = Math.cos(phi);
      let x = r * sinPhi * cosTheta;
      let y = r * sinPhi * sinTheta;
      let z = r * cosPhi;

      positions.push( x, y, z );

      // colors
      var h = Math.random();
      var s = 1;
      var l = 0.75;
      color.setHSL(h,s,l);
      colors.push( color.r, color.g, color.b );
    }

    this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    this.geometry.computeBoundingSphere();

    this.material = new THREE.PointsMaterial( { size: 0.01, opacity: 0, vertexColors: true, transparent: true } );
    this.disposables.push(this.material);

    this.points = new THREE.Points( this.geometry, this.material );
    this.group.add( this.points );

    // this.lensMaterial = new THREE.MeshLambertMaterial({
    //   // color: 0xffffff,
    //   envMap: globals.envMap,
    //   refractionRatio: 0.65
    // })
    // this.lensMaterial.envMap.mapping = THREE.CubeRefractionMapping;
    // this.lens = new THREE.Mesh(globals.sphereGeometry, this.lensMaterial);
    // this.group.add(this.lens);

    // this.refractor = new Refractor( globals.sphereGeometry, {
    //   color: 0x999999,
    //   textureWidth: 1024,
    //   textureHeight: 1024,
    //   shader: WaterRefractionShader
    // } );
    // this.group.add(this.refractor);
    // this.refractor.scale.set(1.1,1.1,1.1);
    // var dudvMap = new TextureLoader().load( `/media/3d/planets/skavo/waterdudv.jpg`);

    // dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
    // this.refractor.material.uniforms[ "tDudv" ].value = dudvMap;
  }

  update(timeDelta, timeElapsed, isSelected) {
    let targetOpacity = isSelected ? 1 : 0;
    let currentOpacity = this.material.opacity;
    this.material.opacity = currentOpacity + (targetOpacity - currentOpacity)*(1*timeDelta);
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