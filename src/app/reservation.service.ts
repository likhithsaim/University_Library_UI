import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from './reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private httpClient: HttpClient) { }

  public getReservations(): Observable<Reservation[]> {
    return this.httpClient.get<Reservation[]>('http://localhost:8080/reservations');
  }

  public getReservation(readerId: number, bookId: number): Observable<Reservation> {
    return this.httpClient.get<Reservation>('http://localhost:8080/reservation', { params: { readerId, bookId } });
  }

  public postReservation(requestBody: Reservation): Observable<Reservation> {
    return this.httpClient.post<Reservation>('http://localhost:8080/postReservation', requestBody);
  }

  public patchReservation(penalty: number, reservationId: number): Observable<Reservation> {
    return this.httpClient.patch<Reservation>('http://localhost:8080/patchReservation',{}, { params: { penalty, reservationId } });
  }
}
