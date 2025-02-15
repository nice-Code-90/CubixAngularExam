import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  input,
  model,
} from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,

  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  modalId = model<string>('');
  title = model<string>('');
  message = model<string>('');
  showCloseButton = model<boolean>(true);
  confirmButtonText = model<string>('OK');
  confirmButtonClass = model<string>('btn-primary');
  closeButtonText = model<string>('Close');

  @Output() confirm = new EventEmitter<void>();

  showModal(): void {
    const modalElement = document.getElementById(this.modalId());
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
  hideModal(): void {
    const modalElement = document.getElementById(this.modalId());
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
