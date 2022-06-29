import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IContenant } from '../contenant.model';
import { ContenantService } from '../service/contenant.service';
import { ContenantDeleteDialogComponent } from '../delete/contenant-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-contenant',
  templateUrl: './contenant.component.html',
})
export class ContenantComponent implements OnInit {
  contenants?: IContenant[];
  isLoading = false;

  constructor(protected contenantService: ContenantService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.contenantService.query().subscribe({
      next: (res: HttpResponse<IContenant[]>) => {
        this.isLoading = false;
        this.contenants = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IContenant): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(contenant: IContenant): void {
    const modalRef = this.modalService.open(ContenantDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.contenant = contenant;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
