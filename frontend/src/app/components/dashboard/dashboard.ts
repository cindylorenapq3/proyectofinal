import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService, Tarea } from '../../services/task';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  tareas: Tarea[] = [];
  tareaForm!: FormGroup;
  modoEdicion = false;
  tareaEditando: string | null = null;
  mostrarFormulario = false;
  cargando = false;
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarTareas();
  }

  crearFormulario(): void {
    this.tareaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', Validators.maxLength(500)],
      prioridad: ['media', Validators.required],
      fechaVencimiento: ['']
    });
  }

  cargarTareas(): void {
    this.cargando = true;
    this.taskService.obtenerTareas().subscribe({
      next: (response) => {
        this.tareas = response.tareas;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar tareas', error);
        this.cargando = false;
      }
    });
  }

  onSubmit(): void {
    if (this.tareaForm.invalid) {
      this.tareaForm.markAllAsTouched();
      return;
    }

    const tarea = this.tareaForm.value;

    if (this.modoEdicion && this.tareaEditando) {
      this.actualizarTarea(tarea);
    } else {
      this.crearTarea(tarea);
    }
  }

  crearTarea(tarea: any): void {
    this.taskService.crearTarea({ ...tarea, completada: false }).subscribe({
      next: (response) => {
        this.mostrarMensaje('Tarea creada exitosamente', 'success');
        this.cargarTareas();
        this.cancelarFormulario();
      },
      error: (error) => {
        console.error('Error al crear tarea', error);
        this.mostrarMensaje('Error al crear tarea', 'error');
      }
    });
  }

  actualizarTarea(tarea: any): void {
    if (!this.tareaEditando) return;

    this.taskService.actualizarTarea(this.tareaEditando, tarea).subscribe({
      next: (response) => {
        this.mostrarMensaje('Tarea actualizada exitosamente', 'success');
        this.cargarTareas();
        this.cancelarFormulario();
      },
      error: (error) => {
        console.error('Error al actualizar tarea', error);
        this.mostrarMensaje('Error al actualizar tarea', 'error');
      }
    });
  }

  editarTarea(tarea: Tarea): void {
    this.modoEdicion = true;
    this.tareaEditando = tarea._id!;
    this.mostrarFormulario = true;

    this.tareaForm.patchValue({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      prioridad: tarea.prioridad,
      fechaVencimiento: tarea.fechaVencimiento ? 
        new Date(tarea.fechaVencimiento).toISOString().split('T')[0] : ''
    });
  }

  eliminarTarea(id: string): void {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    this.taskService.eliminarTarea(id).subscribe({
      next: () => {
        this.mostrarMensaje('Tarea eliminada exitosamente', 'success');
        this.cargarTareas();
      },
      error: (error) => {
        console.error('Error al eliminar tarea', error);
        this.mostrarMensaje('Error al eliminar tarea', 'error');
      }
    });
  }

  toggleCompletada(tarea: Tarea): void {
    this.taskService.toggleCompletada(tarea._id!).subscribe({
      next: () => {
        this.cargarTareas();
      },
      error: (error) => {
        console.error('Error al cambiar estado', error);
      }
    });
  }

  nuevaTarea(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.tareaEditando = null;
    this.tareaForm.reset({ prioridad: 'media' });
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.tareaEditando = null;
    this.tareaForm.reset({ prioridad: 'media' });
  }

  mostrarMensaje(texto: string, tipo: string): void {
    this.mensaje = texto;
    setTimeout(() => this.mensaje = '', 3000);
  }

  get tareasCompletadas(): number {
    return this.tareas.filter(t => t.completada).length;
  }

  get tareasPendientes(): number {
    return this.tareas.filter(t => !t.completada).length;
  }
}