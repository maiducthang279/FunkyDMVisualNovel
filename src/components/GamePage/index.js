import { doc } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { getData } from '../../services/firebaseServices';
import GamePage from './GamePage';

export async function gameLoader({ params }) {
  if (!params['gameId']) {
    throw new Response('Not Found', { status: 404 });
  }
  return await getData(doc(firestore, 'games', params['gameId']));
}

export default GamePage;
