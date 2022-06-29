import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IContenant, Contenant } from '../contenant.model';
import { ContenantService } from '../service/contenant.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ILien } from 'app/entities/lien/lien.model';
import { LienService } from 'app/entities/lien/service/lien.service';
import { IContenu } from 'app/entities/contenu/contenu.model';
import { ContenuService } from 'app/entities/contenu/service/contenu.service';

@Component({
  selector: 'jhi-contenant-update',
  templateUrl: './contenant-update.component.html',
})
export class ContenantUpdateComponent implements OnInit {
  isSaving = false;

  liensSharedCollection: ILien[] = [];
  contenusSharedCollection: IContenu[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    isCapital: [null, [Validators.required]],
    icone: [],
    iconeContentType: [],
    absisce: [],
    ordonnee: [],
    arriereplan: [],
    arriereplanContentType: [],
    lien: [],
    maison: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected contenantService: ContenantService,
    protected lienService: LienService,
    protected contenuService: ContenuService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.updateForm(contenant);

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
    const contenant = this.createFromForm();
    if (contenant.id !== undefined) {
      this.subscribeToSaveResponse(this.contenantService.update(contenant));
    } else {
      this.subscribeToSaveResponse(this.contenantService.create(contenant));
    }
  }

  trackLienById(_index: number, item: ILien): number {
    return item.id!;
  }

  trackContenuById(_index: number, item: IContenu): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContenant>>): void {
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

  protected updateForm(contenant: IContenant): void {
    this.editForm.patchValue({
      id: contenant.id,
      nom: contenant.nom,
      isCapital: contenant.isCapital,
      icone: contenant.icone,
      iconeContentType: contenant.iconeContentType,
      absisce: contenant.absisce,
      ordonnee: contenant.ordonnee,
      arriereplan: contenant.arriereplan,
      arriereplanContentType: contenant.arriereplanContentType,
      lien: contenant.lien,
      maison: contenant.maison,
    });

    this.liensSharedCollection = this.lienService.addLienToCollectionIfMissing(this.liensSharedCollection, contenant.lien);
    this.contenusSharedCollection = this.contenuService.addContenuToCollectionIfMissing(this.contenusSharedCollection, contenant.maison);
  }

  protected loadRelationshipsOptions(): void {
    this.lienService
      .query()
      .pipe(map((res: HttpResponse<ILien[]>) => res.body ?? []))
      .pipe(map((liens: ILien[]) => this.lienService.addLienToCollectionIfMissing(liens, this.editForm.get('lien')!.value)))
      .subscribe((liens: ILien[]) => (this.liensSharedCollection = liens));

    this.contenuService
      .query()
      .pipe(map((res: HttpResponse<IContenu[]>) => res.body ?? []))
      .pipe(
        map((contenus: IContenu[]) => this.contenuService.addContenuToCollectionIfMissing(contenus, this.editForm.get('maison')!.value))
      )
      .subscribe((contenus: IContenu[]) => (this.contenusSharedCollection = contenus));
  }

  protected createFromForm(): IContenant {
    return {
      ...new Contenant(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      isCapital: this.editForm.get(['isCapital'])!.value,
      iconeContentType: this.editForm.get(['iconeContentType'])!.value,
      icone: this.editForm.get(['icone'])!.value,
      absisce: this.editForm.get(['absisce'])!.value,
      ordonnee: this.editForm.get(['ordonnee'])!.value,
      arriereplanContentType: this.editForm.get(['arriereplanContentType'])!.value,
      arriereplan: this.editForm.get(['arriereplan'])!.value,
      lien: this.editForm.get(['lien'])!.value,
      maison: this.editForm.get(['maison'])!.value,
    };
  }
}
