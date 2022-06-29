import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IContenant } from '../contenant.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-contenant-detail',
  templateUrl: './contenant-detail.component.html',
})
export class ContenantDetailComponent implements OnInit {
  contenant: IContenant | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.contenant = contenant;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
