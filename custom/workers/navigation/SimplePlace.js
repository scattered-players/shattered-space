import Place from './Place';

export default class SimplePlace extends Place {
  constructor(globals, metadata, ObjectConstructor, options) {
    super(globals, metadata);
    
    this.object = new ObjectConstructor(globals, options);
    this.disposables.push(this.object);
    globals.scene.add(this.object.group);

    this.cameraFocus = options.position;
    this.cameraOrbitRadius = options.size * 2;
    this.rotationSpeed = options.rotationSpeed;
  }

  update(timeDelta, timeElapsed, isSelected) {
    this.object.group.rotation.y = (this.object.group.rotation.y + timeDelta * this.rotationSpeed) % (2*Math.PI);
    this.object.update && this.object.update(timeDelta, timeElapsed, isSelected);
    // this.object.group.rotation.x = 0.25;
  }

  dispose() {
    this.globals.scene.remove(this.object);
    this.globals = null;
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