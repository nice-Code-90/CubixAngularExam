import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../auth/models/user.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-baselayout',
  templateUrl: './baselayout.component.html',
  styleUrl: './baselayout.component.scss',
})
export class BaseLayoutComponent implements OnInit {
  user: User | undefined;

  protected authService = inject(AuthService);

  ngOnInit(): void {
    this.user = this.authService.currentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
