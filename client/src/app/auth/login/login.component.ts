import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ModalComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username?: string;
  password?: string;
  errorMessage: string = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild('errorModal') errorModal!: ModalComponent;

  login(): void {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe({
        next: () => {
          this.router.navigate(['/recipes']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.showErrorModal('Hibás felhasználónév vagy jelszó');
        },
      });
    } else {
      this.showErrorModal('Kérjük, adja meg a felhasználónevet és a jelszót');
    }
  }

  private showErrorModal(message: string): void {
    this.errorMessage = message;
    if (this.errorModal) {
      this.errorModal.modalId = 'errorModal';
      this.errorModal.title = 'Error';
      this.errorModal.message = message;
      this.errorModal.showModal();
    } else {
      console.error('errorModal is not initialized');
    }
  }
}
