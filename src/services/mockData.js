import cat1 from '../assets/images/zyro-image (1).png';
import cat2 from '../assets/images/zyro-image.png';

// const node = {
//   id: 1,
//   nodeName: '',
//   type: 'dialog | choice | event',
//   character: 'characterId | null',
//   content: 'content',
//   nextId: 2,
//   eventType: '',
//   params: {
//     backgroundUrl: '',
//   },
// };
// const nodeDialog = {
//   type: 'dialog',
//   character: 'characterId | null',
//   content: 'content | option question',
//   nextId: 2,
// };
// const nodeChoice = {
//   type: 'choice',
//   content: 'option question ?...',
//   options: [
//     {
//       content: 'option content',
//       nextId: 3,
//     },
//   ],
// };
// const nodeEvent = [
//   {
//     type: 'event',
//     eventType: 'Set Background',
//     params: {
//       backgroundImage: '',
//     },
//   },
//   {
//     type: 'event',
//     eventType: 'Set Character',
//     params: {
//       characterName: '',
//       characterImage: '',
//       position: 'left | right',
//     },
//   }
// ];

// const character = {
//   id: 0,
//   name: 'Bup',
// };

export const mockData = [
  {
    id: 0,
    type: 'event',
    eventType: 'Set Background',
    params: {
      backgroundImage:
        'https://cdnb.artstation.com/p/assets/images/images/052/085/069/large/nils-firas-living-room-render-v001.jpg?1658914986',
    },
    nextId: 1,
  },
  {
    id: 1,
    type: 'event',
    eventType: 'Set Character',
    params: {
      id: 0,
      image: cat1,
      position: 'left',
    },
    nextId: 2,
  },
  {
    id: 2,
    type: 'event',
    eventType: 'Set Character',
    params: {
      id: 1,
      image: cat2,
      position: 'right',
    },
    nextId: 3,
  },
  {
    id: 3,
    type: 'dialog',
    character: { id: 0, name: 'Búp' },
    content: 'Chào bạn!',
    nextId: 4,
  },
  {
    id: 4,
    type: 'dialog',
    character: { id: 1, name: 'Gin' },
    content: 'Ờ, chào bạn!',
    nextId: 5,
  },
  {
    id: 5,
    type: 'choice',
    content: 'Bạn muốn nói gì?',
    options: [
      {
        content: 'Tôi mới đến đây',
        nextId: 6,
      },
      {
        content: 'Tôi là Búp',
        nextId: 7,
      },
    ],
  },
  {
    id: 6,
    type: 'dialog',
    character: { id: 0, name: 'Búp' },
    content: 'Tôi mới đến đây!',
    nextId: 4,
  },
  {
    id: 7,
    type: 'dialog',
    character: { id: 0, name: 'Búp' },
    content: 'Tôi là Búp!',
    nextId: 8,
  },
  {
    id: 8,
    type: 'dialog',
    character: { id: 1, name: 'Gin' },
    content: 'Búp trong Búp măng non?',
    nextId: 9,
  },
  {
    id: 9,
    type: 'dialog',
    character: { id: 0, name: 'Búp' },
    content: 'Nô nô nô! Búp trong Búp sen ngon!',
  },
];
