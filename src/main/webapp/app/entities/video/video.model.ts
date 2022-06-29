export interface IVideo {
  id?: number;
  url?: string | null;
}

export class Video implements IVideo {
  constructor(public id?: number, public url?: string | null) {}
}

export function getVideoIdentifier(video: IVideo): number | undefined {
  return video.id;
}
