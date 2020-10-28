import Seriously from './seriously.js';
import shaderbooth from './shaderbooth';
import virtualBackground from './virtual-background';
import aiScene from './ai-scene';
import starterShader from '../glsl/starter.glsl';
import glowEyesShader from '../glsl/gloweyes.glsl';

export default  {
  none: async ( { canvas, localInputVideo } ) => {
    let seriously = new Seriously();
    let camera = seriously.source(localInputVideo);
    let target = seriously.target(canvas);
    target.source = camera;
    seriously.go()

    return () => {
      seriously.stop();
      seriously.destroy();
      camera = null;
      target = null;
      seriously = null;
    }
  },
  blur: async ( { canvas, localInputVideo } ) => {
    let seriously = new Seriously();
    let camera = seriously.source(localInputVideo);
    let blur = seriously.effect('blur');
    blur.source = camera;
    let target = seriously.target(canvas);
    target.source = blur;
    seriously.go()

    return () => {
      seriously.stop();
      seriously.destroy();
      camera = null;
      blur = null;
      target = null;
      seriously = null;
    }
  },
  booth: async ( { canvas, localInputVideo } ) => await shaderbooth.start({ canvas, localInputVideo, shader: starterShader }),
  woomera: async ( { canvas, localInputVideo } ) => await shaderbooth.start({ canvas, localInputVideo, shader: glowEyesShader }),
  virtualBackground: async ( { canvas, localInputVideo } ) => await virtualBackground.start({ canvas, localInputVideo }),
  aiScene: ({ canvas }) => aiScene.start(canvas)
};