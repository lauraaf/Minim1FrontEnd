import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';  
import { NavbarComponent } from '../navbar/navbar.component';
import { response } from 'express';
import { error } from 'node:console';
import { Evento } from '../../models/event.model';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit{ 
  events: Evento[] = []; // Lista de eventos con tipado Event
  totalEvents: number = 0;
  desplegado: boolean[] = []; // Controla si el desplegable de cada event está abierto o cerrado
  // Propiedad para almacenar el mensaje de error
  errorMessage: string | null = null;

  nuevoEvent: Evento = {
    name: ' ',
    description: ' ',
    date: new Date(),
    ubication: [],
    creator: ' ',
  };

  eventEdicion: Evento | null = null; // Event en proceso de edición
  indiceEdicion: number | null = null; // Almacena el índice del event en edición
  formSubmitted: boolean = false; // Indica si se ha enviado el formulario

  constructor(private eventService: EventService) {}
  ngOnInit(): void {
   this.loadEvents();

  }
  //Funció per cerregar tots els events
  //Funció per cerregar tots els events
  loadEvents(): void {
    // Llamar al servicio para obtener los eventos
    this.eventService.getEvent().subscribe(data => {
      this.events = data; // Suponiendo que el servicio retorna un array de eventos
      this.desplegado = new Array(this.events.length).fill(false);
    });
  }

  // Función para agregar o modificar un evento
  agregarElemento(eventForm: NgForm): void {
    this.formSubmitted = true;
  
    if (this.indiceEdicion !== null) {
      // Estamos en modo edición, modificar el event existente
      this.events[this.indiceEdicion] = { ...this.nuevoEvent, _id: this.events[this.indiceEdicion]._id };
  
    // Actualizar el usuario en la API
      this.eventService.updateUser( this.events[this.indiceEdicion]).subscribe(response => {
        if(response)
        console.log('Usuario actualizado:', response);
      });
  
      // Limpiar el estado de edición
      this.indiceEdicion = null;
    } else {
      // Modo agregar nuevo evento
      const eventJSON: Evento = {
        name: this.nuevoEvent.name,
        description: this.nuevoEvent.description,
        date: this.nuevoEvent.date,
        ubication: this.nuevoEvent.ubication,
        creator: this.nuevoEvent.creator
      };
  
      // Enviar el usuario a la API a través del UserService
      this.eventService.createEvent(eventJSON).subscribe(response => {
        console.log('Evento agregado:', response);

        eventJSON._id=response._id;
        // Agregar el usuario con el _id generado por la API al array de usuarios en el frontend
        this.events.push({ ...eventJSON});
        this.desplegado.push(false); // Añadir un nuevo estado de desplegado
      });
    }
  
    // Limpiar los campos del formulario y restablecer su estado
    this.resetForm(eventForm);
  }

  // Función para limpiar el formulario
  resetForm(eventForm: NgForm): void { // Aceptar userForm como parámetro
    this.nuevoEvent = {
      name: ' ',
      description: ' ',
      date: new Date(),
      ubication: [],
      creator: ' ',
    };
    this.formSubmitted = false; // Restablecer el estado del formulario para no mostrar errores
    eventForm.resetForm(); // Reiniciar el formulario en la vista
  }

  // Función para preparar la edición de un evento
  prepararEdicion(event: Evento, index: number): void {
    this.eventEdicion = { ...event }; // Clonar el evento para la edición
    this.nuevoEvent = { ...event }; // Cargar los datos del evento en el formulario
    this.indiceEdicion = index; // Almacenar el índice del evento en edición
    this.desplegado[index] = true; // Abrir el desplegable del evento que se está editando
  }

  // Función para eliminar un usuario usando el _id
  eliminarElemento(index: number): void {
    const eventoAEliminar = this.events[index];
    console.log(eventoAEliminar);
    if (!eventoAEliminar._id) {
      console.error('El evento no tiene un _id válido. No se puede eliminar.');
      alert('El evento no se puede eliminar porque no está registrado en la base de datos.');
      return;
    }
  
    if (confirm(`¿Estás seguro de que deseas eliminar a ${eventoAEliminar.name}?`)) {
      // Eliminar a través del UserService usando el _id como identificador
      this.eventService.deleteEvent(eventoAEliminar._id).subscribe(
        response => {
          console.log('Evento eliminado:', response);
          this.events.splice(index, 1);
          this.desplegado.splice(index, 1);
        },
        error => {
          console.error('Error al eliminar el evento:', error);
          alert('Error al eliminar el evento. Por favor, inténtalo de nuevo.');
        }
      );
    }
  }

  // Función para alternar la visualización del desplegable
  toggleDesplegable(index: number): void {
    this.desplegado[index] = !this.desplegado[index];
  }

}
