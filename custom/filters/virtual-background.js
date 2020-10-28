const bodyPix = require('@tensorflow-models/body-pix');
export default {
  start: async ( { canvas, localInputVideo } ) => {
    let netOptions = {
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    };
    const net = await bodyPix.load(netOptions);

    let isDestroyed = false;
    let rAF = requestAnimationFrame(render);
    async function render() {
      console.log('HUH?', localInputVideo.videoWidth);
      const segmentation = await net.segmentPerson(localInputVideo, {
        internalResolution: 'low',
        segmentationThreshold: 0.7,
        maxDetections: 5,
        scoreThreshold: 0.3,
        nmsRadius: 20,
      });

      if(!isDestroyed){
        rAF = requestAnimationFrame(render);
      }
    }
    return () => {
      isDestroyed = true;
      cancelAnimationFrame(rAF);
    };
  }
}