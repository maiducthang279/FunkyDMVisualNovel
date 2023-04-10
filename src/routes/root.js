import { notification } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Loading from '../components/shared/Loading';
import { auth, firestore } from '../services/firebase';
import { getUserData, setData, updateData } from '../services/firebaseServices';
import { permissionState, userState } from './store';

export default function Root() {
  const [, contextHolder] = notification.useNotification();
  const setUser = useSetRecoilState(userState);
  const setPermission = useSetRecoilState(permissionState);
  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, uid } = user;
        const displayName =
          user.displayName ||
          user.providerData.find((data) => data.displayName)?.displayName ||
          'Default Name';
        const photoURL =
          user.photoURL ||
          user.providerData.find((data) => data.photoURL)?.photoURL ||
          '';
        getUserData(uid)
          .then((user) => {
            if (user.exists()) {
              const currentProfile = user.data();
              if (!(currentProfile.photoURL.length > 0)) {
                updateData(doc(firestore, 'users', uid), {
                  photoURL,
                });
              }
              setUser({ ...currentProfile, uid, email, photoURL });
              setPermission(currentProfile?.permission || 'user');
            } else {
              setData(doc(firestore, 'users', uid), {
                displayName,
                photoURL,
                email,
                permission: 'user',
              });
              setUser({ uid, displayName, photoURL, email });
            }
          })
          .catch(() => {
            setUser({ uid, displayName, photoURL, email });
            setPermission(null);
          });
      } else {
        setUser(null);
        setPermission(null);
      }
    });
    return () => {
      observer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Outlet></Outlet>
      {contextHolder}
      <Loading />
    </>
  );
}
