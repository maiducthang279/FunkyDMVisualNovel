import { atom } from 'recoil';

export const FORM_STATUS = {
  SAVED: 'SAVED',
  DIRTY: 'DIRTY',
  SAVING: 'SAVING',
};

export const userState = atom({
  key: 'user',
  default: null,
});

export const permissionState = atom({
  key: 'permission',
  default: 'user',
});

export const backgroundState = atom({
  key: 'background',
  default: null,
});

export const formStatusState = atom({
  key: 'formStatus',
  default: FORM_STATUS.SAVED,
});

export const currentEditedSceneState = atom({
  key: 'currentEditedScene',
  default: null,
});

export const currentEditedGameState = atom({
  key: 'currentEditedGame',
  default: null,
});

export const currentEditedGameProjectState = atom({
  key: 'currentEditedGameProject',
  default: null,
});

export const charactersState = atom({
  key: 'characters',
  default: [],
});

export const backgroundsState = atom({
  key: 'backgrounds',
  default: [],
});

export const scenesState = atom({
  key: 'scenes',
  default: [],
});
