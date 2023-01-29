import React from 'react';
import './Background.scss';

const Background = ({ src }) => {
  return (
    <div className="background_container">
      {src && <img src={src} alt="background"></img>}
    </div>
  );
};

export default Background;
