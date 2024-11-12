import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../../models/message.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`; 
  private usersUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) { }
  
  // Obtenir tots els missatges
  getMessages(id: string): Observable<Message> {
    console.log('hola')
    return this.http.get<Message>(`${this.apiUrl}/getDestMessages/${id}`);
  }
  // Crear-Enviar Missatge
  createMessage(message: Message): Observable<Message> { 
    return this.http.post<Message>(this.apiUrl, message); 
  }
  // Eliminar missatge
  deleteMessage(id: string): Observable<void> { 
    return this.http.delete<void>(`${this.apiUrl}/${id}`); 
  }
  // Nuevo método para obtener el nombre de usuario por ID 
  getUserNameById(id: string): Observable<{ name: string }> { 
    return this.http.get<{ name: string }>(`${this.usersUrl}/${id}`); }
}
