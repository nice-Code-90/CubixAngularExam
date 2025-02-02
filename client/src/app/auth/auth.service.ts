import { Injectable, signal } from '@angular/core';
import { User } from './models/user.model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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

  register(username: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((user: User) => user.username === username)) {
      return false;
    }
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  login(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http.post(url, body, { headers }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          const user: User = { username, token: response.token };
          this.storeUser(user);
        }
      })
    );
  }

  private storeUser(user: User) {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  private clearStoredUser() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
  logout() {
    this.clearStoredUser();
    this._currentUser.set(undefined);
    this.router.navigate(['/login']);
  }
}
