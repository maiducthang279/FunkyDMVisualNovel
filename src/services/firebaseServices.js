import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, firestore, googleProvider } from './firebase';

export async function getListData(query) {
  const posts = await getDocs(query);
  const result = [];
  posts.forEach((doc) => {
    result.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return result;
}

export async function getData(query) {
  const post = await getDoc(query);
  if (post.exists()) {
    return {
      id: post.id,
      ...post.data(),
    };
  } else {
    throw new Response('Not Found', { status: 404 });
  }
}

export async function addData(documentRef, data) {
  return await addDoc(documentRef, data);
}

export async function setData(documentRef, data) {
  return await setDoc(documentRef, data);
}

export async function updateData(documentRef, data) {
  return await updateDoc(documentRef, data);
}

export async function deleteData(documentRef) {
  return await deleteDoc(documentRef);
}

export async function createUser(email, password, displayName) {
  return createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const { user } = userCredential;
      return updateProfile(user, {
        displayName,
      });
    }
  );
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function resetPasswordEmail(email) {
  return sendPasswordResetEmail(auth, email);
}

export async function logout() {
  return signOut(auth);
}

export async function getUserData(uid) {
  return getDoc(doc(firestore, 'users', uid));
}

export async function updateUserProfile(data) {
  if (!auth.currentUser) {
    throw new Error('Has no user');
  }
  updateData(doc(firestore, 'users', auth.currentUser.uid), {
    displayName: data.displayName || '',
    photoURL: data.photoURL || '',
    description: data.description || '',
  });
  return updateProfile(auth.currentUser, {
    displayName: data.displayName,
    photoURL: data.photoURL,
  });
}
