import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAlbumPhoto, AlbumPhoto } from '../album-photo.model';
import { AlbumPhotoService } from '../service/album-photo.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-album-photo-update',
  templateUrl: './album-photo-update.component.html',
})
export class AlbumPhotoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    images: [],
    imagesContentType: [],
    description: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected albumPhotoService: AlbumPhotoService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ albumPhoto }) => {
      this.updateForm(albumPhoto);
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
    const albumPhoto = this.createFromForm();
    if (albumPhoto.id !== undefined) {
      this.subscribeToSaveResponse(this.albumPhotoService.update(albumPhoto));
    } else {
      this.subscribeToSaveResponse(this.albumPhotoService.create(albumPhoto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAlbumPhoto>>): void {
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

  protected updateForm(albumPhoto: IAlbumPhoto): void {
    this.editForm.patchValue({
      id: albumPhoto.id,
      images: albumPhoto.images,
      imagesContentType: albumPhoto.imagesContentType,
      description: albumPhoto.description,
    });
  }

  protected createFromForm(): IAlbumPhoto {
    return {
      ...new AlbumPhoto(),
      id: this.editForm.get(['id'])!.value,
      imagesContentType: this.editForm.get(['imagesContentType'])!.value,
      images: this.editForm.get(['images'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
