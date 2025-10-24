import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  estaAutenticado(): boolean {
    return this.authService.estaAutenticado();
  }

  irADashboard(): void {
    if (this.estaAutenticado()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/registro']);
    }
  }
}