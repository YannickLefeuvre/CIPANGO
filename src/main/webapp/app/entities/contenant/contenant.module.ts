import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ContenantComponent } from './list/contenant.component';
import { ContenantDetailComponent } from './detail/contenant-detail.component';
import { ContenantUpdateComponent } from './update/contenant-update.component';
import { ContenantDeleteDialogComponent } from './delete/contenant-delete-dialog.component';
import { ContenantRoutingModule } from './route/contenant-routing.module';

@NgModule({
  imports: [SharedModule, ContenantRoutingModule],
  declarations: [ContenantComponent, ContenantDetailComponent, ContenantUpdateComponent, ContenantDeleteDialogComponent],
  entryComponents: [ContenantDeleteDialogComponent],
})
export class ContenantModule {}
