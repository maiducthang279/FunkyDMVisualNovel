import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../shared/Header';

const MainPage = () => {
  const { pathname } = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (pathname === '/') {
      setIsFullscreen(false);
    } else {
      setIsFullscreen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {isFullscreen && <Header></Header>}
      <Outlet></Outlet>
    </>
  );
};

export default MainPage;
