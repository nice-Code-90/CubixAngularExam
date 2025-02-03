import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });
  errorMessage: string = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild('errorModal') errorModal!: ModalComponent;

  login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username!, password!).subscribe({
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
