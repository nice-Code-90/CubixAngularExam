import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,

  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() modalId: string = '';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() showCloseButton: boolean = true;
  @Input() confirmButtonText: string = 'OK';
  @Input() confirmButtonClass: string = 'btn-primary';
  @Input() closeButtonText: string = 'Close';

  @Output() confirm = new EventEmitter<void>();

  showModal(): void {
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
  hideModal(): void {
    const modalElement = document.getElementById(this.modalId);
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
