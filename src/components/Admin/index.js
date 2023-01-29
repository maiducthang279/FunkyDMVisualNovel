import { collection, query } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { getListData } from '../../services/firebaseServices';
import Management from './Management';

export async function getAllUsers() {
  return await getListData(query(collection(firestore, 'users')));
}

export default Management;
