// userprofile.component.ts
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-userprofile',
  imports: [CommonModule, RouterModule, ModalComponent],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.scss',
})
export class UserprofileComponent implements OnInit {
  user: User | undefined;
  isDeleting = false;
  deleteMessage: string = '';
  isLoading = signal(false);

  constructor(private authService: AuthService) {}
  @ViewChild('deleteAccountModal') deleteAccountModal!: ModalComponent;
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
    this.deleteAccountModal.title = 'Confirm Account Deletion';
    this.deleteAccountModal.message =
      'Are you sure you want to delete your account? This action cannot be undone.';
    this.deleteAccountModal.confirmButtonText = 'Delete Account';
    this.deleteAccountModal.confirmButtonClass = 'btn-danger';
    this.deleteAccountModal.showCloseButton = true;
    this.deleteAccountModal.closeButtonText = 'Kepp my account alive';
    this.deleteAccountModal.confirm.subscribe(() => {
      this.confirmDeleteAccount();
    });
    this.deleteAccountModal.showModal();
  }

  confirmDeleteAccount() {
    console.log('confirm delete called');
    this.isDeleting = true;
    this.isLoading.set(true);

    this.authService.deleteAccount().subscribe({
      next: () => {
        // Sikeres törlés után kijelentkeztetés és átirányítás
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.deleteMessage = error.message || 'Failed to delete account';
        this.isDeleting = false;
        this.isLoading.set(false);
      },
    });
  }
}
