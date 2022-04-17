import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>('http://localhost:8080/users');
  }

  public getAdminUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>('http://localhost:8080/admins');
  }

  public getUsersOfBook(departmentId:number, subject:string, title:string): Observable<User[]> {
    return this.httpClient.get<User[]>('http://localhost:8080/usersOfBook',{params:{departmentId, subject, title}});
  }
}
