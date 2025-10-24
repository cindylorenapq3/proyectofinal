import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tarea {
  _id?: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  fechaVencimiento?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // Obtener todas las tareas
  obtenerTareas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener una tarea específica
  obtenerTarea(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear nueva tarea
  crearTarea(tarea: Tarea): Observable<any> {
    return this.http.post(this.apiUrl, tarea);
  }

  // Actualizar tarea
  actualizarTarea(id: string, tarea: Partial<Tarea>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tarea);
  }

  // Eliminar tarea
  eliminarTarea(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Cambiar estado de completada
  toggleCompletada(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/toggle`, {});
  }
}