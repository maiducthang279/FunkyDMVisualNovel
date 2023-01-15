import React from 'react';
import './Button.scss';

const MenuButton = ({ children, ...rest }) => {
  return (
    <div className="button" {...rest}>
      {children}
    </div>
  );
};

export default MenuButton;
