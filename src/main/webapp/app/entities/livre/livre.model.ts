export interface ILivre {
  id?: number;
  imagesContentType?: string | null;
  images?: string | null;
  description?: string | null;
}

export class Livre implements ILivre {
  constructor(
    public id?: number,
    public imagesContentType?: string | null,
    public images?: string | null,
    public description?: string | null
  ) {}
}

export function getLivreIdentifier(livre: ILivre): number | undefined {
  return livre.id;
}
