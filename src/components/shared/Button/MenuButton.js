import React from 'react';
import './Button.scss';

const MenuButton = ({ children, disabled, onClick, ...rest }) => {
  const handleOnClick = (event) => {
    if (!disabled) {
      onClick && onClick(event);
    }
  };

  return (
    <div
      onClick={handleOnClick}
      className={disabled ? 'button disabled' : 'button active'}
      {...rest}
    >
      {children}
    </div>
  );
};

export default MenuButton;
