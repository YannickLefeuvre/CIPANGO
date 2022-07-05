import { IContenant } from 'app/entities/contenant/contenant.model';

export interface IContenu {
  id?: number;
  nom?: string;
  iconeContentType?: string | null;
  icone?: string | null;
  absisce?: number | null;
  ordonnee?: number | null;
  arriereplanContentType?: string | null;
  arriereplan?: string | null;
  contenantino?: IContenant | null;
}

export class Contenu implements IContenu {
  constructor(
    public id?: number,
    public nom?: string,
    public iconeContentType?: string | null,
    public icone?: string | null,
    public absisce?: number | null,
    public ordonnee?: number | null,
    public arriereplanContentType?: string | null,
    public arriereplan?: string | null,
    public contenantino?: IContenant | null
  ) {}
}

export function getContenuIdentifier(contenu: IContenu): number | undefined {
  return contenu.id;
}
