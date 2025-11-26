import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {

  MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule
} from '@angular/material/table';
import {MatSort, MatSortHeader, MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';

import {LiveAnnouncer} from '@angular/cdk/a11y';
import {take} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {Operation} from '../../types/operation';
import {OperationService} from '../../services/operation.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'cp-wallet',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatIconModule,CommonModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class WalletComponent implements AfterViewInit {

  saldo = 100;
  dostepneSrodki = 1000;

  @ViewChild(MatSort)
  protected readonly matSort!: MatSort;

  protected readonly displayedColumns: string[] = ["OperationDate", "Amount","OperationType"];
  protected readonly dataSource = new MatTableDataSource<Operation>();

  private readonly _operationService = inject(OperationService);
  private readonly _liveAnnouncer = inject(LiveAnnouncer);

  constructor() {
    this._operationService.getAll()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(data => this.dataSource.data = data);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort;
  }

  protected announceSortChange(): void {
    this._liveAnnouncer.announce("Zmieniono sortowanie transakcji");
  }
}
