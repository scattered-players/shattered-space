import config from 'config';

import insideWorker from '../inside-worker'
import AIScene from './AIScene';
// import TestScene from './TestScene';

let aiScreen = null;

function connectWebSocket() {
  let socket = new WebSocket(`${config.SOCKET_ADDRESS}/faces-output`);

  socket.onopen = function() {
    console.log('Faces Connection Established!');
  }

  socket.onmessage = function(e) {
    let data = JSON.parse(e.data);
    if(aiScreen){
      aiScreen.updateAR(data);
    }
  };

  socket.onerror = function(e) {
    console.error('UHOH', e);
    try {
      socket.close();
    } catch(e) {
      onClose();
    }
  };

  socket.onclose = function onClose() {
    console.log('connection closed, retrying in 1 second');
    setTimeout(connectWebSocket, 1000);
  };
}

connectWebSocket();

const worker = insideWorker(e => {
  const { data } = e;
  if (data.canvas) {
    if(aiScreen) {
      aiScreen.destroy();
      aiScreen = null;
    }
    aiScreen = new AIScene(data.canvas, data.width, data.height, data.dpi, sendToMainThread);
  } else if (data.type) {
    // Messages from main thread
    let { type } = data;
    if(aiScreen){
      switch(type){
        case 'UPDATE':
          aiScreen.updateScene(data.state);
          break;
        case 'RESIZE':
          aiScreen.resizeScene(data.width, data.height);
          break;
        case 'DESTROY':
          aiScreen.destroy();
          aiScreen = null;
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