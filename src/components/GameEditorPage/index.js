import { collection, doc, query, where } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import {
  getData,
  getListData,
  updateData,
} from '../../services/firebaseServices';
import GameEditorPage from './GameEditorPage';

export async function gameEditorLoader({ params }) {
  if (!params['gameId']) {
    throw new Response('Not Found', { status: 404 });
  }
  const game = await getData(doc(firestore, 'games', params['gameId']));
  const projectQuery = getData(doc(firestore, 'projects', game.projectId));
  const charactersQuery = getListData(
    query(
      collection(firestore, 'characters'),
      where('projectId', '==', game.projectId)
    )
  );
  const backgroundsQuery = getListData(
    query(
      collection(firestore, 'backgrounds'),
      where('projectId', '==', game.projectId)
    )
  );
  const scenesQuery = getListData(
    query(collection(firestore, 'scenes'), where('gameId', '==', game.id))
  );
  const [project, characters, backgrounds, scenes] = await Promise.all([
    projectQuery,
    charactersQuery,
    backgroundsQuery,
    scenesQuery,
  ]);
  return {
    project,
    game,
    characters,
    backgrounds,
    scenes: scenes.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export async function editGameMetadata(id, values) {
  const game = await updateData(doc(firestore, 'games', id), {
    ...values,
    modifiedTime: Date.now(),
  });

  return game;
}

export async function publishGame(id, isPublish = true) {
  const game = await updateData(doc(firestore, 'games', id), {
    status: isPublish ? 'Published' : 'Work in progress',
    modifiedTime: Date.now(),
  });

  return game;
}

export async function editGameVariable(id, variables) {
  const game = await updateData(doc(firestore, 'games', id), {
    variables: variables,
  });

  return game;
}

export default GameEditorPage;
