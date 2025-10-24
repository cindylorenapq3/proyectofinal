import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, Usuario } from '../../services/auth';
import { UserService } from '../../services/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  passwordForm!: FormGroup;
  usuario: Usuario | null = null;
  cargando = false;
  mensaje = '';
  tipoMensaje = '';
  mostrarCambioPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      if (usuario) {
        this.crearFormularioPerfil();
      }
    });

    this.crearFormularioPassword();
  }

  crearFormularioPerfil(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre || '', [Validators.required, Validators.minLength(3)]],
      bio: [this.usuario?.bio || '', Validators.maxLength(500)],
      avatar: [this.usuario?.avatar || '']
    });
  }

  crearFormularioPassword(): void {
    this.passwordForm = this.fb.group({
      passwordActual: ['', [Validators.required, Validators.minLength(6)]],
      passwordNuevo: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required]
    }, {
      validators: this.passwordsCoinciden
    });
  }

  passwordsCoinciden(form: FormGroup) {
    const nuevo = form.get('passwordNuevo');
    const confirmar = form.get('confirmarPassword');
    
    if (nuevo && confirmar && nuevo.value !== confirmar.value) {
      confirmar.setErrors({ noCoinciden: true });
      return { noCoinciden: true };
    }
    return null;
  }

  actualizarPerfil(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const datos = this.perfilForm.value;

    this.userService.actualizarPerfil(datos).subscribe({
      next: (response) => {
        this.authService.actualizarUsuario(response.usuario);
        this.mostrarMensaje('Perfil actualizado exitosamente', 'success');
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al actualizar perfil', error);
        this.mostrarMensaje('Error al actualizar perfil', 'error');
        this.cargando = false;
      }
    });
  }

  cambiarPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const { passwordActual, passwordNuevo } = this.passwordForm.value;

    this.userService.cambiarPassword(passwordActual, passwordNuevo).subscribe({
      next: (response) => {
        this.mostrarMensaje('Contraseña actualizada exitosamente', 'success');
        this.passwordForm.reset();
        this.mostrarCambioPassword = false;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cambiar contraseña', error);
        this.mostrarMensaje(error.error?.error || 'Error al cambiar contraseña', 'error');
        this.cargando = false;
      }
    });
  }

  mostrarMensaje(texto: string, tipo: string): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 3000);
  }

  toggleCambioPassword(): void {
    this.mostrarCambioPassword = !this.mostrarCambioPassword;
    if (!this.mostrarCambioPassword) {
      this.passwordForm.reset();
    }
  }

  get nombre() {
    return this.perfilForm.get('nombre');
  }

  get bio() {
    return this.perfilForm.get('bio');
  }

  get passwordActual() {
    return this.passwordForm.get('passwordActual');
  }

  get passwordNuevo() {
    return this.passwordForm.get('passwordNuevo');
  }

  get confirmarPassword() {
    return this.passwordForm.get('confirmarPassword');
  }
}