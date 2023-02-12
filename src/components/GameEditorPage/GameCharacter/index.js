import { collection, doc } from 'firebase/firestore';
import { firestore } from '../../../services/firebase';
import {
  addData,
  deleteData,
  updateData,
} from '../../../services/firebaseServices';
import GameCharacters from './GameCharacters';

export async function addNewCharacter(values) {
  const newCharacter = await addData(collection(firestore, 'characters'), {
    ...values,
  });
  return newCharacter;
}
export async function updateCharacter(id, value) {
  return await updateData(doc(firestore, 'characters', id), {
    ...value,
  });
}
export async function deleteCharacter(id) {
  return await deleteData(doc(firestore, 'characters', id));
}

export default GameCharacters;
