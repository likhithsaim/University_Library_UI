import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private httpClient: HttpClient) { }

  public getBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>('http://localhost:8080/books');
  }

  public getBooksForUi(): Observable<Book[]> {
    return this.httpClient.get<Book[]>('http://localhost:8080/booksForUi');
  }
}
