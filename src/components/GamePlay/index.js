import { doc } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { getData } from '../../services/firebaseServices';
import GamePlay from './GamePlay';

export async function sceneLoader(sceneId) {
  return await getData(doc(firestore, 'scenes', sceneId));
}

export default GamePlay;
