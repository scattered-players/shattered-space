import insideWorker from '../inside-worker'
import NavigationScreen from './NavigationScreen';

let navScreen = null;

const worker = insideWorker(e => {
  const { data } = e;
  if (data.type) {
    // Messages from main thread
    let { type } = data;
    switch(type){
      case 'INIT_SCENE':
        if(navScreen) {
          navScreen.destroy();
          navScreen = null;
        }
        navScreen = new NavigationScreen(sendToMainThread);
        break;
      case 'NEW_CANVAS':
        navScreen && navScreen.initRenderer(data.canvas, data.width, data.height, data.dpi);
        break;
      case 'UPDATE':
        navScreen && navScreen.updateScene(data.state);
        break;
      case 'REMOVE_CANVAS':
        navScreen && navScreen.destroyRenderer();
        break;
      case 'RESIZE':
        navScreen && navScreen.resizeScene(data.width, data.height);
        break;
      case 'DESTROY':
        navScreen && navScreen.destroy();
        navScreen = null;
        break;
      default: console.error(`No handler for message of type ${type}`);
    }
  }
});

function sendToMainThread(message) {
  worker.post(message);
}


export default worker;