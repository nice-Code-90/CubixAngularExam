import { Component, EventEmitter, Input, model, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,

  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent {
  modalId = model<string>('');
  oldPassword = model<string>('');
  newPassword = model<string>('');
  confirmPassword = model<string>('');
  errorMessage = model<string>('');

  @Output() passwordChanged = new EventEmitter<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>();
  private modalInstance: Modal | undefined;

  showModal(): void {
    console.log('showModal called');
    const modalElement = document.getElementById(this.modalId());
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  hideModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
  onSubmit() {
    this.passwordChanged.emit({
      oldPassword: this.oldPassword(),
      newPassword: this.newPassword(),
      confirmPassword: this.confirmPassword(),
    });
  }
}
