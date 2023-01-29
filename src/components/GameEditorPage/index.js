import { doc } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { getData, updateData } from '../../services/firebaseServices';
import GameEditorPage from './GameEditorPage';

export async function gameEditLoader({ params }) {
  if (!params['gameId']) {
    throw new Response('Not Found', { status: 404 });
  }
  const game = await getData(doc(firestore, 'games', params['gameId']));

  return game;
}

export async function editGameMetadata(id, values) {
  const game = await updateData(doc(firestore, 'games', id), {
    ...values,
    modifiedTime: Date.now(),
  });

  return game;
}

export default GameEditorPage;
