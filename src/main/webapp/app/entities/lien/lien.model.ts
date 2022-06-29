import { IContenant } from 'app/entities/contenant/contenant.model';

export interface ILien {
  id?: number;
  nom?: string;
  iconeContentType?: string | null;
  icone?: string | null;
  absisce?: number | null;
  ordonnee?: number | null;
  arriereplanContentType?: string | null;
  arriereplan?: string | null;
  villeOrigine?: IContenant | null;
  villeCible?: IContenant | null;
}

export class Lien implements ILien {
  constructor(
    public id?: number,
    public nom?: string,
    public iconeContentType?: string | null,
    public icone?: string | null,
    public absisce?: number | null,
    public ordonnee?: number | null,
    public arriereplanContentType?: string | null,
    public arriereplan?: string | null,
    public villeOrigine?: IContenant | null,
    public villeCible?: IContenant | null
  ) {}
}

export function getLienIdentifier(lien: ILien): number | undefined {
  return lien.id;
}
