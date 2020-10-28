import createWorker from './workers/create-worker';
import { workerFps } from './stats';

const workerUrl = document.querySelector('[rel=preload][as=script][href^="/assets/intro"]').href;
const worker = createWorker(workerUrl, e => {
  let { data } = e;
  switch(data.type) {
    case 'RENDER':
      workerFps && workerFps.update();
      break;
    case 'SAVE_FILE':
      var text = data.data,
      blob = new Blob([text], { type: 'text/plain' }),
      anchor = document.createElement('a');

      anchor.download = "Artemis2.obj";
      anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
      anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
      anchor.click();
      break;
    default: console.log(`No handler for message of type ${data.type}`);
  }
});


export default class IntroPlugin {
  constructor(canvas) {
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