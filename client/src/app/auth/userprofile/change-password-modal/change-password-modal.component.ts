import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent {
  @Input() modalId: string = '';
  oldPassword: string = 'Old password';
  newPassword: string = 'New password';
  confirmPassword: string = 'Confirm new password';
  errorMessage: string = 'Change password failed';

  @Output() passwordChanged = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match';
      return;
    }

    this.authService
      .changePassword(this.oldPassword, this.newPassword)
      .subscribe({
        next: () => {
          this.passwordChanged.emit();
          this.hideModal();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to change password';
        },
      });
  }

  showModal(): void {
    console.log('showmodal called');
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  hideModal() {
    const modalElement = document.getElementById('changePasswordModal');
    if (modalElement) {
      modalElement.style.display = 'none';
    }
  }
}
