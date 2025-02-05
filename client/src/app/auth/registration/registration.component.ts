import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
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

  public registration() {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly';
      this.clearErrorMessage();
      return;
    }

    const { username, password, passwordCheck } = this.registrationForm.value;

    if (password !== passwordCheck) {
      this.errorMessage = 'Passwords do not match';
      this.clearErrorMessage();
      return;
    }

    this.isLoading.set(true);

    this.auth
      .register(username!, password!)
      .pipe(
        tap(() => {
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          this.errorMessage = err.message;
          this.clearErrorMessage();
          return [];
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }

  private clearErrorMessage() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
