import React from 'react';
import './GameCard.scss';

const GameCard = ({ game, isActive, onClick }) => {
  return (
    <div
      className={`card ${isActive ? 'active' : ''}`}
      onClick={() => onClick && onClick(game)}
    >
      <div className="content">
        <img
          src={game.thumbnail}
          alt="logo"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = 'https://picsum.photos/id/104/400/360';
          }}
        ></img>
      </div>
    </div>
  );
};

export default GameCard;
