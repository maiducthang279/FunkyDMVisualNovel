import { Spin } from 'antd';
import React from 'react';
import './Loading.scss';

const Loading = () => {
  return (
    <div className="loading_container">
      <Spin size="large" />
    </div>
  );
};

export default Loading;
