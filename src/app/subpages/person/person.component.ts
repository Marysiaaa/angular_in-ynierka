import { AfterViewInit, Component, inject, ViewChild } from "@angular/core";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { RoutePath } from "../../enums/route-path";
import { take } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import {PersonService} from '../../services/person.service';
import {User} from '../../types/user';
import {DatePipe} from '@angular/common';

@Component({
  selector: "cp-Person",
  imports: [MatTableModule, MatSortModule, MatIconModule, DatePipe],
  templateUrl: "./person.component.html",
  styleUrl: "./person.component.scss"
})
export class PersonComponent implements AfterViewInit {
  @ViewChild(MatSort)
  protected readonly matSort!: MatSort;
  protected readonly displayedColumns: string[] = ["UserId", "Name","Surname","Email","PhoneNumber","Role","RegistrationDate"];
  protected readonly dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

  private readonly _personService: PersonService = inject(PersonService);
  private readonly _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);

  constructor() {
    this._personService
      .GetUsers()
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
