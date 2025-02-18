import { Injectable, signal } from '@angular/core';
import { User } from './models/user.model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.baseUrl}/users`;

  private readonly _currentUser = signal<User | undefined>(undefined);
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor(private readonly router: Router, private http: HttpClient) {
    const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);

    if (storedUser) {
      this._currentUser.set(JSON.parse(storedUser));
    }
  }
  get currentUser() {
    return this._currentUser.asReadonly();
  }
  isLoggedIn(): boolean {
    return localStorage.getItem(this.CURRENT_USER_KEY) !== null;
  }
  getAuthHeaders(): HttpHeaders {
    const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
    let token = '';
    if (currentUser) {
      const user = JSON.parse(currentUser);
      token = user.token;
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  register(username: string, password: string) {
    const user = { username, password };
    return this.http.post<User>(this.baseUrl, user).pipe(
      switchMap(() => this.login(username, password)),
      tap(() => this.router.navigate(['/'])),
      catchError((error) => {
        return throwError(
          () => new Error(error.error.message || 'Registration failed')
        );
      })
    );
  }

  login(username: string, password: string) {
    const url = `${this.baseUrl}/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http.post(url, body, { headers }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          const user: User = { username, token: response.token };
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        }
      })
    );
  }
  getToken(): string | null {
    const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
    let token = '';
    if (currentUser) {
      const user = JSON.parse(currentUser);
      token = user.token;
    }
    return token;
  }

  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this._currentUser.set(undefined);
    this.router.navigate(['/recipes']);
  }

  getUserProfile(): Observable<User | undefined> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.baseUrl}/profile`, { headers }).pipe(
      catchError((error) => {
        return throwError(
          () => new Error(error.error.message || 'Failed to fetch user profile')
        );
      })
    );
  }

  deleteAccount() {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/delete`, { headers }).pipe(
      tap(() => {
        this.logout();
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error.error.message || 'Failed to delete account')
        );
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string) {
    const headers = this.getAuthHeaders();
    const body = { oldPassword, newPassword };
    return this.http
      .put<void>(`${this.baseUrl}/change-password`, body, { headers })
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.error.message || 'Failed to change password')
          );
        })
      );
  }
}
