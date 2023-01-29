import { doc } from 'firebase/firestore';
import { firestore } from '../../../services/firebase';
import { getData } from '../../../services/firebaseServices';
import ProtectedRoute from './ProtectedRoute';

export async function gameEditorLoader({ params }) {
  if (!params['gameId']) {
    throw new Response('Not Found', { status: 404 });
  }
  const game = await getData(doc(firestore, 'games', params['gameId']));
  const project = await getData(doc(firestore, 'projects', game.projectId));
  return {
    project,
    game,
  };
}

export default ProtectedRoute;
