import { ILien } from 'app/entities/lien/lien.model';
import { IContenu } from 'app/entities/contenu/contenu.model';

export interface IContenant {
  id?: number;
  nom?: string;
  isCapital?: boolean;
  iconeContentType?: string | null;
  icone?: string | null;
  absisce?: number | null;
  ordonnee?: number | null;
  arriereplanContentType?: string | null;
  arriereplan?: string | null;
  lien?: ILien | null;
  maison?: IContenu | null;
  lienOrigine?: ILien | null;
  lienCible?: ILien | null;
}

export class Contenant implements IContenant {
  constructor(
    public id?: number,
    public nom?: string,
    public isCapital?: boolean,
    public iconeContentType?: string | null,
    public icone?: string | null,
    public absisce?: number | null,
    public ordonnee?: number | null,
    public arriereplanContentType?: string | null,
    public arriereplan?: string | null,
    public lien?: ILien | null,
    public maison?: IContenu | null,
    public lienOrigine?: ILien | null,
    public lienCible?: ILien | null
  ) {
    this.isCapital = this.isCapital ?? false;
  }
}

export function getContenantIdentifier(contenant: IContenant): number | undefined {
  return contenant.id;
}
