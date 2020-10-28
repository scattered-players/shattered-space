import seedrandom from 'seedrandom';
import assetKeyEnum from '../../assetKey';
import Place from './Place';
import BivBoy from './BivBoy';
import Station9 from './Station9';
import TLW from './TLW';
import Station4th from './Station4th';
import ArtemisStation from './ArtemisStation';
import SkavoStation from './SkavoStation';
import Wilbumore from './Wilbumore';
import Krashcan from './Krashcan';
import AskrYggdrasils from './AskrYggdrasils';
import Eu24 from './Eu24';
import Sorak from './Sorak';
import CosmicRapids from './CosmicRapids';
import SimplePlace from './SimplePlace';

let placeSeed = Math.random();
console.log('PLACESEED', placeSeed);
let placeRng = seedrandom(placeSeed);
const randFactor = 100;

export default {
  [assetKeyEnum.Neptunish]: (globals, metadata) => new Place(globals, {
    path: 'neptunish',
    size: 1.6,
    rotationSpeed: 1,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Boriken]: (globals, metadata) => new SimplePlace(globals, metadata, Place, {
    path: 'boriken',
    size: 1.6,
    rotationSpeed: 1,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Artemis]: (globals, metadata) => new SimplePlace(globals, metadata, ArtemisStation, {
    path: 'luxias',
    size: 3,
    rotationSpeed: 1,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Skavo]: (globals, metadata) => new SimplePlace(globals, metadata, SkavoStation, {
    size: 1,
    rotationSpeed: 0,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.BivBoy]: (globals, metadata) => new SimplePlace(globals, metadata, BivBoy, {
    size: 0.5,
    rotationSpeed: 0,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Station9]: (globals, metadata) => new SimplePlace(globals, metadata, Station9, {
    size: 1,
    rotationSpeed: 0,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.TLW]: (globals, metadata) => new SimplePlace(globals, metadata, TLW, {
    size: 0.5,
    rotationSpeed: 0,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Station4th]: (globals, metadata) => new SimplePlace(globals, metadata, Station4th, {
    size: 0.5,
    rotationSpeed: 0,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Sorak]: (globals, metadata) => new SimplePlace(globals, metadata, Sorak, {
    size: 2.5,
    rotationSpeed: 0,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Wilbumore]: (globals, metadata) => new SimplePlace(globals, metadata, Wilbumore, {
    size: 2.5,
    rotationSpeed: 0,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Krashcan]: (globals, metadata) => new SimplePlace(globals, metadata, Krashcan, {
    size: 1.6,
    rotationSpeed: 0.5,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.AskrYggdrasils]: (globals, metadata) => new SimplePlace(globals, metadata, AskrYggdrasils, {
    size:0.5,
    rotationSpeed: 0.5,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.eu24]: (globals, metadata) => new SimplePlace(globals, metadata, Eu24, {
    size: 0.5,
    rotationSpeed: 0,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Mnemea]: (globals, metadata) => new SimplePlace(globals, metadata, Place, {
    path: 'mnemea',
    size: 2.5,
    rotationSpeed: 1,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Amaranthine]: (globals, metadata) => new SimplePlace(globals, metadata, Place, {
    path: 'amaranthine',
    size: 2.5,
    rotationSpeed: 1,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.Stedwrald]: (globals, metadata) => new SimplePlace(globals, metadata, Place, {
    path: 'stedwrald',
    size: 2.5,
    rotationSpeed: 1,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),
  [assetKeyEnum.CosmicRapids]: (globals, metadata) => new SimplePlace(globals, metadata, CosmicRapids, {
    size: 1.6,
    rotationSpeed: 0.25,
    position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  }),

  // [assetKeyEnum.Terra]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'terra',
  //   size: 0.5,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // }),
  // [assetKeyEnum.Europa]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'europa',
  //   size: 0.6,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // }),
  // [assetKeyEnum.Neptunish]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'neptunish',
  //   size: 1.6,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // }),
  // [assetKeyEnum.Eve]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'eve',
  //   size: 0.25,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // }),
  // [assetKeyEnum.Mordor]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'mordor',
  //   size: 0.25,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // }),
  // [assetKeyEnum.Minmus]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'minmus',
  //   size: 0.25,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // }),
  // [assetKeyEnum.RedGreen]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'firered-leafgreen',
  //   size: 0.25,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // }),
  // [assetKeyEnum.HotJupiter]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'hotjupiter',
  //   size: 2,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // }),
  // [assetKeyEnum.Somethin]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'somethin',
  //   size: 0.25,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // }),
  // [assetKeyEnum.Ruby]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'ruby',
  //   size: 0.3,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // }),
  // [assetKeyEnum.Woomera]: (globals, metadata) => new Place(globals, metadata, {
  //   path: 'woomera',
  //   size: 0.3,
  //   rotationSpeed: 1,
  //   position: [placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2), placeRng()*randFactor - (randFactor/2)]
  // })
}