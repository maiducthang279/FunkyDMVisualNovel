import { collection, doc } from 'firebase/firestore';
import { firestore } from '../../../services/firebase';
import {
  addData,
  deleteData,
  updateData,
} from '../../../services/firebaseServices';
import GameBackgrounds from './GameBackgrounds';

export async function addNewBackground(values) {
  const newBackground = await addData(collection(firestore, 'backgrounds'), {
    ...values,
  });
  return newBackground;
}
export async function updateBackground(id, value) {
  return await updateData(doc(firestore, 'backgrounds', id), {
    ...value,
  });
}
export async function deleteBackground(id) {
  return await deleteData(doc(firestore, 'backgrounds', id));
}

export default GameBackgrounds;
