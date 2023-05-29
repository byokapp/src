import { ImageMetadata } from './stores/persistentAppState';

export const KNOWN_IMAGES: ImageMetadata[] = [
  {
    id: 'keys',
    src: 'https://image.lexica.art/full_jpg/4bf63fcf-85fe-4788-b994-8fde5bd33e8b',
    tooltip: 'prompt: a black background with a frame of keys',
    title: 'keys (AI-generated)',
    attributionHref: 'https://lexica.art/prompt/3b66d6b5-2e80-4a19-978a-cc1745f840c0',
    attributionText: 'Lexica',
  },
  {
    id: 'enlightenment',
    src: 'https://image.lexica.art/full_jpg/805ee41f-fdf4-474d-99f9-f24fdae7801c',
    tooltip: 'prompt: A man achieving enlightenment holding Bitcoin',
    title: 'User (AI-generated)',
    attributionHref: 'https://lexica.art/prompt/51d5a34d-d132-4751-84b4-aa919a885b56',
    attributionText: 'Lexica',
  },
  {
    id: 'Pepe',
    src: 'https:///mui.com/static/images/cards/contemplative-reptile.jpg',
    tooltip: 'Dis you, Pepe?',
    title: 'famous Lizard developer',
    attributionHref: 'https://mui.com/material-ui/react-card/',
    attributionText: 'MUI.com',
  },
  {
    id: 'Finish Line',
    src: 'https://images.unsplash.com/photo-1656337449543-81902dd908df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    tooltip: 'F1 Grand Prix Monaco',
    title: 'Port Hercule, Monaco-Ville yacht harbour',
    attributionHref: 'https://unsplash.com/photos/JlY4UTcbUqw?utm_content=creditShareLink',
    attributionText: 'Maxime Vandenberge/Unsplash',
  },
];
