import { collection, query, where } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { getListData } from '../../services/firebaseServices';
import HomePage from './HomePage';

export async function homeLoader() {
  const games = await getListData(
    query(collection(firestore, 'games'), where('status', '==', 'Published'))
  );
  return games;
}

export default HomePage;
