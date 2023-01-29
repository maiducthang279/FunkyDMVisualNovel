import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import {
  addData,
  deleteData,
  getListData,
  updateData,
} from '../../services/firebaseServices';
import AdminUserTable from '../Admin/AdminUserTable';
import CreatorPage from './CreatorPage';

export async function getProjects(uid) {
  return await getListData(
    query(
      collection(firestore, 'projects'),
      where('members', 'array-contains', uid),
      orderBy('modifiedTime', 'desc')
    )
  );
}

export async function addProject(values) {
  return await addData(collection(firestore, 'projects'), {
    ...values,
    games: [],
    createdTime: Date.now(),
    modifiedTime: Date.now(),
  });
}
export async function editProject(id, values) {
  return await updateData(doc(firestore, 'projects', id), {
    ...values,
    modifiedTime: Date.now(),
  });
}

export async function deleteProject(id) {
  return await deleteData(doc(firestore, 'projects', id));
}

export { AdminUserTable };
export default CreatorPage;
