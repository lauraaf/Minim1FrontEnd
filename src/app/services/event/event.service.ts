import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Paginator } from '../../models/paginator.model';
import { Evento } from '../../models/event.model';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;
  constructor(private http: HttpClient) { }

   // Obtenir tots els events
   getEvent( ): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }
  // Actualitzar un event pel ID
  updateUser(event: Evento): Observable<Evento> {
    console.log("len", sessionStorage.length)
    return this.http.put<Evento>(`${this.apiUrl}/update/${event._id}`, event);
  }
  // Crear un event nou
  createEvent(event: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, event);
  }
  // Eliminar un event pel ID
  deleteEvent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
