import { doc } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { getData } from '../../services/firebaseServices';
import Profile from './Profile';
import ProfileSetting from './ProfileSetting';

export async function profileLoader({ params }) {
  if (!params['userId']) {
    return undefined;
  }
  return await getData(doc(firestore, 'users', params['userId']));
}

export { ProfileSetting };
export default Profile;
