import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILien, Lien } from '../lien.model';
import { LienService } from '../service/lien.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IContenant } from 'app/entities/contenant/contenant.model';
import { ContenantService } from 'app/entities/contenant/service/contenant.service';

@Component({
  selector: 'jhi-lien-update',
  templateUrl: './lien-update.component.html',
})
export class LienUpdateComponent implements OnInit {
  isSaving = false;

  villeOriginesCollection: IContenant[] = [];
  villeCiblesCollection: IContenant[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    icone: [],
    iconeContentType: [],
    absisce: [],
    ordonnee: [],
    arriereplan: [],
    arriereplanContentType: [],
    villeOrigine: [],
    villeCible: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected lienService: LienService,
    protected contenantService: ContenantService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lien }) => {
      this.updateForm(lien);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('cipangoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lien = this.createFromForm();
    if (lien.id !== undefined) {
      this.subscribeToSaveResponse(this.lienService.update(lien));
    } else {
      this.subscribeToSaveResponse(this.lienService.create(lien));
    }
  }

  trackContenantById(_index: number, item: IContenant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILien>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(lien: ILien): void {
    this.editForm.patchValue({
      id: lien.id,
      nom: lien.nom,
      icone: lien.icone,
      iconeContentType: lien.iconeContentType,
      absisce: lien.absisce,
      ordonnee: lien.ordonnee,
      arriereplan: lien.arriereplan,
      arriereplanContentType: lien.arriereplanContentType,
      villeOrigine: lien.villeOrigine,
      villeCible: lien.villeCible,
    });

    this.villeOriginesCollection = this.contenantService.addContenantToCollectionIfMissing(this.villeOriginesCollection, lien.villeOrigine);
    this.villeCiblesCollection = this.contenantService.addContenantToCollectionIfMissing(this.villeCiblesCollection, lien.villeCible);
  }

  protected loadRelationshipsOptions(): void {
    this.contenantService
      .query({ filter: 'lienorigine-is-null' })
      .pipe(map((res: HttpResponse<IContenant[]>) => res.body ?? []))
      .pipe(
        map((contenants: IContenant[]) =>
          this.contenantService.addContenantToCollectionIfMissing(contenants, this.editForm.get('villeOrigine')!.value)
        )
      )
      .subscribe((contenants: IContenant[]) => (this.villeOriginesCollection = contenants));

    this.contenantService
      .query({ filter: 'liencible-is-null' })
      .pipe(map((res: HttpResponse<IContenant[]>) => res.body ?? []))
      .pipe(
        map((contenants: IContenant[]) =>
          this.contenantService.addContenantToCollectionIfMissing(contenants, this.editForm.get('villeCible')!.value)
        )
      )
      .subscribe((contenants: IContenant[]) => (this.villeCiblesCollection = contenants));
  }

  protected createFromForm(): ILien {
    return {
      ...new Lien(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      iconeContentType: this.editForm.get(['iconeContentType'])!.value,
      icone: this.editForm.get(['icone'])!.value,
      absisce: this.editForm.get(['absisce'])!.value,
      ordonnee: this.editForm.get(['ordonnee'])!.value,
      arriereplanContentType: this.editForm.get(['arriereplanContentType'])!.value,
      arriereplan: this.editForm.get(['arriereplan'])!.value,
      villeOrigine: this.editForm.get(['villeOrigine'])!.value,
      villeCible: this.editForm.get(['villeCible'])!.value,
    };
  }
}
