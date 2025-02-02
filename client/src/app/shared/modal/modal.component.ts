import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() modalId: string = '';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() showCloseButton: boolean = true;

  @Output() confirm = new EventEmitter<void>();

  showModal(): void {
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
