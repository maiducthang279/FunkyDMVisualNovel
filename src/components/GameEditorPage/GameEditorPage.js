import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import './GameEditorPage.scss';
import GameMetadataForm from './GameMetadataForm';

const GameEditorPage = () => {
  const loaderData = useLoaderData();
  const [game, setGame] = useState(null);

  useEffect(() => {
    setGame(loaderData.game);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!game) {
    return null;
  }

  return (
    <div>
      <GameMetadataForm game={game}></GameMetadataForm>
    </div>
  );
};

export default GameEditorPage;
