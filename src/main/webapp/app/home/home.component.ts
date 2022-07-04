import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IContenant } from '../entities/contenant/contenant.model';
import { ContenantService } from '../entities/contenant/service/contenant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataUtils } from 'app/core/util/data-util.service';
import { HttpResponse } from '@angular/common/http';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  contenants?: IContenant[];
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    protected contenantsService: ContenantService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  loadAll(): void {
    this.isLoading = true;

    this.contenantsService.query().subscribe({
      next: (res: HttpResponse<IContenant[]>) => {
        this.isLoading = false;
        this.contenants = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
