import createWorker from './workers/create-worker';
// import { workerFps } from './stats';

const workerUrl = document.querySelector('[rel=preload][as=script][href^="/assets/host-worker"]').href;
let worker = null;

function getWorker() {
  if(!worker){
    worker = createWorker(workerUrl, e => {
      let { data } = e;
      switch(data.type) {
        case 'RENDER':
          // workerFps && workerFps.update();
          break;
        default: console.log(`No handler for message of type ${data.type}`);
      }
    });
  }
  return worker
}

class HostPlugin {
  constructor(canvas) {
    getWorker();
    this.canvas = canvas;
    worker.newCanvas(canvas);
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  sendMessage(message) {
    worker.post(message);
  }

  onResize() {
    worker.post({
      type: 'RESIZE',
      width: this.canvas.clientWidth,
      height: this.canvas.clientHeight,
    })
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.canvas = null;
    worker.post({type:'DESTROY'});
  }
}

export default {
  start: function(canvas){
    return new HostPlugin(canvas);
  }
}