import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ContenantComponent } from '../list/contenant.component';
import { ContenantDetailComponent } from '../detail/contenant-detail.component';
import { ContenantUpdateComponent } from '../update/contenant-update.component';
import { ContenantRoutingResolveService } from './contenant-routing-resolve.service';
import { SystemeComponent } from '../systeme/systeme.component';

const contenantRoute: Routes = [
  {
    path: '',
    component: ContenantComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContenantDetailComponent,
    resolve: {
      contenant: ContenantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContenantUpdateComponent,
    resolve: {
      contenant: ContenantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContenantUpdateComponent,
    resolve: {
      contenant: ContenantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/systeme',
    component: SystemeComponent,
    resolve: {
      contenant: ContenantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(contenantRoute)],
  exports: [RouterModule],
})
export class ContenantRoutingModule {}
