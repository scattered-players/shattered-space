import insideWorker from '../inside-worker'
import UghScreen from './UghScreen';

let introScreen = null;

const worker = insideWorker(e => {
  const { data } = e;
  if (data.canvas) {
    if(introScreen) {
      console.log('HMMDESTROY')
      introScreen.destroy();
      introScreen = null;
    }
    introScreen = new UghScreen(data.canvas, data.width, data.height, data.dpi, sendToMainThread);
  } else if (data.type) {
    // Messages from main thread
    let { type } = data;
    if(introScreen){
      switch(type){
        case 'UPDATE':
          // introScreen.updateScene(data.state);
          break;
        case 'RESIZE':
          // introScreen.resizeScene(data.width, data.height);
          break;
        case 'DESTROY':
          console.log('HMMDESTROY')
          introScreen.destroy();
          introScreen = null;
          break;
        default: console.error(`No handler for message of type ${type}`);
      }
    }
  }
});

function sendToMainThread(message) {
  worker.post(message);
}


export default worker;