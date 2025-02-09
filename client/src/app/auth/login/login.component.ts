import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';
import { finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    RouterLink,
    LoadingComponent,
  ],
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
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);

  @ViewChild('errorModal') errorModal!: ModalComponent;

  login(): void {
    this.isLoading.set(true);

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService
        .login(username!, password!)
        .pipe(
          tap(() => this.router.navigate(['/recipes'])),
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.isLoading.set(false))
        )
        .subscribe({
          error: (err) => {
            console.error('Login failed', err);
            this.showErrorModal('Hibás felhasználónév vagy jelszó');
          },
        });
    } else {
      this.showErrorModal('Username and password is required');
      this.isLoading.set(false);
    }
  }

  private showErrorModal(message: string): void {
    if (!this.errorModal) {
      console.error('errorModal is not initialized');
      return;
    }

    this.errorMessage = message;
    this.errorModal.modalId = 'errorModal';
    this.errorModal.title = 'Error';
    this.errorModal.message = message;
    this.errorModal.showModal();
  }
}
