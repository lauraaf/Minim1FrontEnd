import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';  
import { Message } from '../../models/message.model';
import { MessageService } from '../../services/message/message.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  messages: Message[] = [];
  userNames: { [key: string]: string } = {}; // Diccionario para almacenar los nombres de usuario
  formSubmitted = false;
  errorMessage: string | null = null;
  //userId = sessionStorage.getItem('user-id'); 

  nuevoMessage: Message = {
    author: '', 
    destinator: '',
    mnsg: '',
    llegit: false
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    const userId = sessionStorage.getItem('user-id'); // Aquí obtienes el ID del usuario logueado
    if (userId) {
      this.loadMessages(userId);
    }
  }

  loadMessages(userId: string): void {
    this.messageService.getMessages(userId).subscribe(data => {
      this.messages = Array.isArray(data) ? data : [data];
      this.messages.forEach(message => {
        this.loadUserName(message.author);
        this.loadUserName(message.destinator);
      });
    }, error => {
      console.error('Error al cargar los mensajes', error);
      this.errorMessage = 'Error al cargar los mensajes';
    });
  }

  loadUserName(userId: string): void {
    if (!this.userNames[userId]) {
      this.messageService.getUserNameById(userId).subscribe(response => {
        this.userNames[userId] = response.name;
      }, error => {
        console.error(`Error al obtener el nombre de usuario para el ID ${userId}`, error);
      });
    }
  }

  createMessage(): void {
    this.formSubmitted = true;
    if (this.nuevoMessage.author && this.nuevoMessage.destinator && this.nuevoMessage.mnsg) {
      this.messageService.createMessage(this.nuevoMessage).subscribe(response => {
        console.log('Mensaje creado:', response);
        this.messages.push(response);
        this.loadUserName(response.author);
        this.loadUserName(response.destinator);
        this.nuevoMessage = { author: '', destinator: '', mnsg: '', llegit: false };
        this.formSubmitted = false;
      }, error => {
        console.error('Error al crear el mensaje', error);
        this.errorMessage = 'Error al crear el mensaje';
      });
    }
  }

  deleteMessage(id?: string): void {
    if (id) {
      this.messageService.deleteMessage(id).subscribe(() => {
        console.log('Mensaje eliminado');
        this.messages = this.messages.filter(message => message._id !== id);
      }, error => {
        console.error('Error al eliminar el mensaje', error);
        this.errorMessage = 'Error al eliminar el mensaje';
      });
    }
  }
}
