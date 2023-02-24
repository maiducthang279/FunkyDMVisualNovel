import { collection, doc } from 'firebase/firestore';
import { firestore } from '../../../services/firebase';
import {
  addData,
  deleteData,
  updateData,
} from '../../../services/firebaseServices';
import GameScenes from './GameScenes';

export async function addNewScene(values) {
  const newScene = await addData(collection(firestore, `scenes`), {
    ...values,
  });
  return newScene;
}
export async function updateScene(id, value) {
  console.log(value);
  return await updateData(doc(firestore, `scenes`, id), {
    ...value,
  });
}
export async function deleteScene(id) {
  return await deleteData(doc(firestore, `scenes`, id));
}

export default GameScenes;
