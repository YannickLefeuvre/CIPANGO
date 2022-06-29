export interface IPhoto {
  id?: number;
  imagesContentType?: string | null;
  images?: string | null;
  description?: string | null;
}

export class Photo implements IPhoto {
  constructor(
    public id?: number,
    public imagesContentType?: string | null,
    public images?: string | null,
    public description?: string | null
  ) {}
}

export function getPhotoIdentifier(photo: IPhoto): number | undefined {
  return photo.id;
}
