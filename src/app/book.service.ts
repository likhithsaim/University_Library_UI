import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private httpClient: HttpClient) { }

  public getHelloMessage(): Observable<string> {
    return this.httpClient.get<string>('http://localhost:8080/hello');
  }
}
