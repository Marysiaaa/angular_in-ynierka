import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {User} from "../types/user";

@Injectable({
  providedIn: "root"
})
export class PersonService {
  private readonly _users: User[] = [
    {
      UserId: 1,
      Name: "Jan",
      Surname: "Kowalski",
      Email: "jan.kowalski@example.com",
      PhoneNumber: "+48 600 123 456",
      RegistrationDate: "2024-03-15"
    },
    {
      UserId: 2,
      Name: "Anna",
      Surname: "Nowak",
      Email: "anna.nowak@example.com",
      PhoneNumber: "+48 511 789 123",
      RegistrationDate: "2024-07-22"
    }
  ];

  constructor() {
  }


  getAll(): Observable<User[]> {
    return of(this._users);
  }


}
