import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataUtils } from 'app/core/util/data-util.service';
import { IContenant } from '../contenant.model';

@Component({
  selector: 'jhi-systeme',
  templateUrl: './systeme.component.html',
  styleUrls: ['./systeme.component.scss'],
})
export class SystemeComponent implements OnInit {
  contenant: IContenant | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contenant }) => {
      this.contenant = contenant;
    });
  }
}
