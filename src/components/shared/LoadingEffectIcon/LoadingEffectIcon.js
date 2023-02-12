import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

const LoadingEffectIcon = ({ isLoading, icon }) => {
  return isLoading ? <LoadingOutlined /> : icon;
};

export default LoadingEffectIcon;
