import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, RouterLink, ModalComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  username?: string;
  password?: string;
  passwordCheck?: string;
  errorMessage: string = '';

  public registration() {}
}
