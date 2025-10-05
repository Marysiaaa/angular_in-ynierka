import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {
  MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule
} from '@angular/material/table';
import {MatSort, MatSortHeader, MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';

import {LiveAnnouncer} from '@angular/cdk/a11y';
import {take} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {Operation, OperationType} from '../../types/operation';
import {WalletService} from '../../services/wallet.service';
import {CommonModule} from '@angular/common';
import {StatusOrderPipe} from "../../pipes/status-order.pipe";
import {StatusOrder} from "../../types/order";
import {OperationTypePipe} from "../../pipes/operationType.pipe";


@Component({
  selector: 'cp-wallet',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatIconModule, CommonModule, OperationTypePipe],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css',
})
export class WalletComponent implements AfterViewInit {

  saldo = 0;

  @ViewChild(MatSort)
  protected readonly matSort!: MatSort;

  protected readonly displayedColumns: string[] = ["OperationDate", "Amount", "OperationType"];
  protected readonly dataSource = new MatTableDataSource<Operation>();

  private readonly _walletService = inject(WalletService);
  private readonly _liveAnnouncer = inject(LiveAnnouncer);

  constructor() {
    this._walletService.GetOperations()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(data => {
        this.dataSource.data = data
        this.getBalance();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort;
  }

  protected announceSortChange(): void {
    this._liveAnnouncer.announce("Zmieniono sortowanie transakcji");
  }

  depositFunds() {
    const amount = 100;

    this._walletService.DepositFunds(amount)
      .subscribe({
        next: () => this.reloadWallet(),
        error: () => alert('Nie udało się doładować konta')
      });
  }

  private getBalance() {
    this._walletService.GetWallet()
      .subscribe(data => {
        this.saldo = data.balance;
      })
  }

  private reloadWallet() {
    this._walletService.GetOperations()
      .subscribe(data => {
        this.dataSource.data = data;
        this.getBalance();
      });
  }

  protected readonly OperationType = OperationType;
}
