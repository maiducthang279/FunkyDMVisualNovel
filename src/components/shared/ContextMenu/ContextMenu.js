import React from 'react';
import './ContextMenu.scss';

const ContextMenu = ({
  menu,
  isShow,
  x,
  y,
  canvasX = 0,
  canvasY = 0,
  displayType = ['default'],
  onClick,
  onClose,
}) => {
  const handleOnClick = (key, event) => {
    onClose && onClose();
    onClick && onClick(key, event);
  };
  const handleOnClose = (event) => {
    event.preventDefault();
    onClose && onClose();
  };
  const filterMenu = (type) => menu.filter((item) => item.type === type);
  const renderMenuItem = (item) => (
    <div
      className="menu-item"
      key={item.key}
      onClick={() =>
        handleOnClick(item.key, { x: x - canvasX, y: y - canvasY })
      }
    >
      {item.name}
    </div>
  );
  const renderMenu = () => {
    return displayType
      .map((type, index) => {
        if (type !== 'default') {
          return [
            <div className="divider" key={index}></div>,
            ...filterMenu(type).map((item) => renderMenuItem(item)),
          ];
        }
        return filterMenu(type).map((item) => renderMenuItem(item));
      })
      .flat();
  };
  return (
    <div
      className={`context-menu-backdrop ${isShow ? 'show' : 'hide'}`}
      onClick={handleOnClose}
      onContextMenu={handleOnClose}
    >
      <div className={`context-menu-container`} style={{ top: y, left: x }}>
        {renderMenu()}
      </div>
    </div>
  );
};

export default ContextMenu;
