export default class Place {
  constructor(globals, metadata) {
    this.disposables = [];
    this.metadata = metadata;
    this.globals = globals;
  }

  dispose() {
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