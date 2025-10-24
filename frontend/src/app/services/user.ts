import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Actualizar perfil
  actualizarPerfil(datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, datos);
  }

  // Cambiar contraseña
  cambiarPassword(passwordActual: string, passwordNuevo: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, {
      passwordActual,
      passwordNuevo
    });
  }
}