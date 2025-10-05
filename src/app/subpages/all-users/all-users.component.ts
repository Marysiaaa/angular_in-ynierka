import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {User} from '../../types/user';
import {PersonService} from '../../services/person.service';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {take} from 'rxjs';

@Component({
  selector: 'cp-all-users',
  imports: [
    DatePipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSortHeader,
    MatTable,
    MatSort,
    MatHeaderCellDef
  ],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements AfterViewInit {
  @ViewChild(MatSort)
  protected readonly matSort!: MatSort;
  protected readonly displayedColumns: string[] = ["UserId", "Name", "Surname", "Email", "PhoneNumber", "Role", "RegistrationDate"];
  protected readonly dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

  private readonly _personService: PersonService = inject(PersonService);
  private readonly _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);

  constructor() {
    this._personService
      .GetAllUsers()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((data: User[]): void => {
        this.dataSource.data = data;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort;
  }

  protected async announceSortChange(): Promise<void> {
    await this._liveAnnouncer.announce("Zmieniono sortowanie osób");
  }
}



