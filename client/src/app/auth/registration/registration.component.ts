import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, LoadingComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
    passwordCheck: new FormControl<string>('', [Validators.required]),
  });
  errorMessage: string = '';
  isLoading = signal(false);

  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  destroyRef = inject(DestroyRef);

  public registration(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const { username, password, passwordCheck } = this.registrationForm.value;

    if (!username || !password || !passwordCheck) {
      this.setErrorMessage('Please fill out the form correctly');
      return;
    }

    if (this.isPasswordMismatch(password, passwordCheck)) {
      return;
    }

    this.isLoading.set(true);

    this.auth
      .register(username!, password!)
      .pipe(
        tap(() => this.router.navigate(['/recipes'])),
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.handleError(err);
          return [];
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe();
  }

  private isFormInvalid(): boolean {
    if (this.registrationForm.invalid) {
      this.setErrorMessage('Please fill out the form correctly');
      return true;
    }
    return false;
  }

  private isPasswordMismatch(password: string, passwordCheck: string): boolean {
    if (password !== passwordCheck) {
      this.setErrorMessage('Passwords do not match');
      return true;
    }
    return false;
  }

  private setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.clearErrorMessage();
  }

  private clearErrorMessage() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  private handleError(error: any): void {
    this.setErrorMessage(error.message || 'Registration failed');
  }
}
