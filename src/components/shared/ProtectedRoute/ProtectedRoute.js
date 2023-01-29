import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../../../routes/store';

const ProtectedRoute = ({ permission, children }) => {
  const loaderData = useLoaderData();

  const [user] = useRecoilState(userState);
  const [isCorrect, setIsCorrect] = useState(null);
  useEffect(() => {
    if (user) {
      if (checkPermission(permission)) {
        handleCorrect();
      } else {
        handleIncorrect();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkPermission = (currentPermission) => {
    switch (currentPermission) {
      case 'EDIT_GAME':
        return user?.uid && loaderData?.project?.members.includes(user.uid);
      default:
        return false;
    }
  };

  const handleCorrect = () => {
    setIsCorrect('correct');
  };
  const handleIncorrect = () => {
    setIsCorrect('error');
  };
  const renderError = () => (
    <div
      id="error-page"
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>You don't have the right to access this page!</h1>
      <p>
        <Link to={'/'}>Back to home</Link>
      </p>
    </div>
  );

  if (isCorrect === 'correct') {
    return <>{children}</>;
  }
  if (isCorrect === 'error') {
    return renderError();
  }
  return null;
};

export default ProtectedRoute;
