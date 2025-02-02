import { Component, inject } from '@angular/core';
import { User } from '../../auth/models/user.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-baselayout',
  imports: [],
  templateUrl: './baselayout.component.html',
  styleUrl: './baselayout.component.scss',
})
export class BaseLayoutComponent {
  user: User | undefined;

  protected authService = inject(AuthService);

  ngOnInit(): void {
    this.user = this.authService.currentUser();
  }
  logout(): void {
    this.authService.logout();
  }
}
