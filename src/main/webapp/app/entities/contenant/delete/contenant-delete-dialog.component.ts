import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IContenant } from '../contenant.model';
import { ContenantService } from '../service/contenant.service';

@Component({
  templateUrl: './contenant-delete-dialog.component.html',
})
export class ContenantDeleteDialogComponent {
  contenant?: IContenant;

  constructor(protected contenantService: ContenantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contenantService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
