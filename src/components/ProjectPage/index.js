import { arrayUnion, collection, doc, query, where } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import {
  addData,
  deleteData,
  deleteListData,
  getData,
  getListData,
  updateData,
} from '../../services/firebaseServices';
import ProjectPage from './ProjectPage';

const mappingUserData = (user) => ({
  id: user.id,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export async function projectLoader({ params }) {
  if (!params['projectId']) {
    throw new Response('Not Found', { status: 404 });
  }
  const project = await getData(
    doc(firestore, 'projects', params['projectId'])
  );
  const creator = await getData(doc(firestore, 'users', project.creator));
  const members = await getListData(
    query(
      collection(firestore, 'users'),
      where('__name__', 'in', project.members)
    )
  );
  const games = await getListData(
    query(collection(firestore, 'games'), where('projectId', '==', project.id))
  );
  return {
    ...project,
    creator: mappingUserData(creator),
    memberIds: project.members,
    members: members.map((member) => mappingUserData(member)),
    games: games.map((item) => ({ key: item.id, ...item })),
  };
}

export async function inviteMember(projectId, members, userId) {
  const memberIds = members.map((member) => member.id);
  if (memberIds.includes(userId)) {
    throw Error('Duplicate id');
  } else {
    const newMember = await getData(doc(firestore, 'users', userId));

    await updateData(doc(firestore, 'projects', projectId), {
      members: arrayUnion(userId),
      modifiedTime: Date.now(),
    });
    return mappingUserData(newMember);
  }
}

export async function addNewGame(values) {
  const newGame = await addData(collection(firestore, 'games'), {
    status: 'Work in progress',
    description: 'Nội dung đang được phát triển',
    thumbnail: '',
    background: '',
    ...values,
    createdTime: Date.now(),
    modifiedTime: Date.now(),
  });
  return newGame;
}

export async function deleteGame(id) {
  const scenes = await getListData(
    query(collection(firestore, 'scenes'), where('gameId', '==', id))
  );
  await deleteListData(scenes, 'scenes');
  return await deleteData(doc(firestore, 'games', id));
}

export default ProjectPage;
