import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IContenu } from '../contenu.model';
import { ContenuService } from '../service/contenu.service';
import { ContenuDeleteDialogComponent } from '../delete/contenu-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-contenu',
  templateUrl: './contenu.component.html',
})
export class ContenuComponent implements OnInit {
  contenus?: IContenu[];
  isLoading = false;

  constructor(protected contenuService: ContenuService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.contenuService.query().subscribe({
      next: (res: HttpResponse<IContenu[]>) => {
        this.isLoading = false;
        this.contenus = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IContenu): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(contenu: IContenu): void {
    const modalRef = this.modalService.open(ContenuDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.contenu = contenu;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
