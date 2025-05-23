import jsmediatags from 'jsmediatags-web';

const thumbnailCache: Record<string, string> = {};

const DEFAULT_THUMBNAIL = '/assets/Music-default.png';

interface Tag {
  tags: {
    picture?: {
      data: number[];
      format: string;
    };
    title?: string;
    artist?: string;
    album?: string;
  };
}

export async function getMusicThumbnailFromURL(fileUrl: string): Promise<string> {
  if (thumbnailCache[fileUrl]) {
    return Promise.resolve(thumbnailCache[fileUrl]);
  }
  
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    return new Promise<string>((resolve) => {
      jsmediatags.read(blob, {
        onSuccess: (tag: Tag) => {
          if (tag.tags.picture) {
            const { data, format } = tag.tags.picture;
            const base64String = btoa(String.fromCharCode(...new Uint8Array(data)));
            const imageUrl = `data:${format};base64,${base64String}`;
            thumbnailCache[fileUrl] = imageUrl;
            resolve(imageUrl);
          } else {
            resolve(getFallbackThumbnail(fileUrl));
          }
        },
        onError: (error) => {
          console.error('Error extracting thumbnail:', error);
          resolve(getFallbackThumbnail(fileUrl));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching MP3 file:', error);
    return getFallbackThumbnail(fileUrl);
  }
}

export function getFallbackThumbnail(trackName: string): string {
  if (trackName.includes('ユメガタリ')) {
    return '/assets/Music-ユメガタリ.png';
  } else if (trackName.includes('슈슈보보')) {
    return '/assets/Music-슈슈보보.png';
  }
  
  return DEFAULT_THUMBNAIL;
} 