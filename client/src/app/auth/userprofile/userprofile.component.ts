// userprofile.component.ts
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-userprofile',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    ModalComponent,
    ChangePasswordModalComponent,
  ],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.scss',
})
export class UserprofileComponent implements OnInit {
  user: User | undefined;
  isDeleting = false;
  deleteMessage: string = '';
  isLoading = signal(false);
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  destroyRef = inject(DestroyRef);

  constructor(private authService: AuthService) {}
  @ViewChild('generalModal') generalModal!: ModalComponent;
  @ViewChild('changePasswordModal')
  changePasswordModal!: ChangePasswordModalComponent;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  ngOnInit(): void {
    // A resolver által betöltött adatok elérése
    this.route.data.subscribe((data) => {
      this.user = data['user'];
    });
  }

  deleteAccount() {
    // Modal beállítása
    this.generalModal.title.set('Confirm Account Deletion');
    this.generalModal.message.set(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    this.generalModal.confirmButtonText.set('Delete Account');
    this.generalModal.confirmButtonClass.set('btn-danger');
    this.generalModal.showCloseButton.set(true);
    this.generalModal.closeButtonText.set('Kepp my account alive');
    this.generalModal.confirm.subscribe(() => {
      this.confirmDeleteAccount();
    });
    this.generalModal.showModal();
  }

  confirmDeleteAccount() {
    console.log('confirm delete called');
    this.isDeleting = true;
    this.isLoading.set(true);

    this.authService
      .deleteAccount()
      .pipe(
        tap(() => {
          this.authService.logout();
          this.router.navigate(['/']);
        }),
        catchError((error) => {
          this.deleteMessage = error.message || 'Failed to delete account';
          this.isDeleting = false;
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  changePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    if (newPassword !== confirmPassword) {
      this.changePasswordModal.hideModal();
    }

    this.isLoading.set(true);
    this.authService
      .changePassword(oldPassword, newPassword)
      .pipe(
        tap(() => {
          this.router.navigate(['/profile']),
            takeUntilDestroyed(this.destroyRef),
            this.changePasswordModal.hideModal();
          this.generalModal.title.set('Password Changed');
          this.generalModal.message.set(
            'Password has been changed succesfully'
          );
          this.generalModal.confirmButtonText.set('OK');
          this.generalModal.confirmButtonClass.set('btn-primary');
          this.generalModal.showCloseButton.set(false);
          this.generalModal.showModal();

          finalize(() => this.isLoading.set(false));
        }),
        catchError((error) => {
          this.changePasswordModal.hideModal();

          this.generalModal.title.set('Error');
          this.generalModal.message.set(error.message);
          this.generalModal.confirmButtonText.set('OK');
          this.generalModal.confirmButtonClass.set('btn-primary');
          this.generalModal.showCloseButton.set(false);

          this.generalModal.showModal();

          this.errorMessage = error.message || 'Failed to change password';
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }
  resetPasswordFields() {
    this.oldPassword = this.newPassword = this.confirmPassword = '';
  }

  notImplemented() {
    this.generalModal.title.set('INFO');
    this.generalModal.message.set('Function not implemented yet');
    this.generalModal.confirmButtonText.set('OK');
    this.generalModal.confirmButtonClass.set('btn-primary');
    this.generalModal.showCloseButton.set(false);
    this.generalModal.showModal();
  }
  onPasswordChanged(event: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    this.changePassword(
      event.oldPassword,
      event.newPassword,
      event.confirmPassword
    );
  }
}
