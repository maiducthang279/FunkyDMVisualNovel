import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { backgroundState } from '../../routes/store';
import Background from '../shared/Background/Background';
import Header from '../shared/Header';

import './MainPage.scss';

const MainPage = () => {
  const [background] = useRecoilState(backgroundState);

  return (
    <div className="main_container">
      <Background src={background}></Background>
      <Header></Header>
      <Outlet></Outlet>
    </div>
  );
};

export default MainPage;
