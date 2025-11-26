import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Operation } from "../types/operation";

@Injectable({
  providedIn: "root"
})
export class OperationService {

  private readonly _operation: Operation[] = [
    {  OperationDate: "2025-10-15" ,Amount:50, OperationType: "wyksiegowanie" },
    {  OperationDate: "2025-10-18", Amount:50, OperationType: "wyksiegowanie" }
  ];

  constructor() {}


  getAll(): Observable<Operation[]> {
    return of(this._operation);
  }



}
