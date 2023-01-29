import { atom } from 'recoil';

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
