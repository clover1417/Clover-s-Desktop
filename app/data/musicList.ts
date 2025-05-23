// Music list for the music player widget
import { getFallbackThumbnail } from '../utils/extractor';

export interface MusicTrack {
  src: string;
  name: string;
  thumbnail: string;
}

export const musicTracks: MusicTrack[] = [
  {
    src: '/musics/tagmp3_ユメガタリ-ユメの喫茶店.mp3',
    name: 'ユメガタリ - ユメの喫茶店',
    thumbnail: getFallbackThumbnail('ユメガタリ')
  },
  {
    src: '/musics/슈슈보보 - Coffee Time.mp3',
    name: '슈슈보보 - Coffee Time',
    thumbnail: getFallbackThumbnail('슈슈보보')
  }
];

// Get a random track from the music list
export function getRandomTrack(): MusicTrack {
  const randomIndex = Math.floor(Math.random() * musicTracks.length);
  return musicTracks[randomIndex];
}

// Find track index by src
export function findTrackIndex(src: string): number {
  const index = musicTracks.findIndex(track => track.src === src);
  return index >= 0 ? index : 0;
}

// Get next track
export function getNextTrack(currentIndex: number): MusicTrack {
  const nextIndex = (currentIndex + 1) % musicTracks.length;
  return musicTracks[nextIndex];
}

// Get previous track
export function getPrevTrack(currentIndex: number): MusicTrack {
  const prevIndex = (currentIndex - 1 + musicTracks.length) % musicTracks.length;
  return musicTracks[prevIndex];
} 