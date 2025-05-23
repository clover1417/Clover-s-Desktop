declare module 'jsmediatags-web' {
  interface Tags {
    picture?: {
      data: number[];
      format: string;
    };
    title?: string;
    artist?: string;
    album?: string;
    [key: string]: any;
  }

  interface Tag {
    tags: Tags;
  }

  interface TagCallbacks {
    onSuccess: (tag: Tag) => void;
    onError: (error: any) => void;
  }

  function read(file: Blob | string, callbacks: TagCallbacks): void;

  export default {
    read
  };
} 