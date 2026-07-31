import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { LoginCredentials, LoginResponse, User } from '../models/user.model';

const TOKEN_KEY = 'task_manager_token';
const USER_KEY = 'task_manager_user';

/**
 * Maneja el login y la sesión del usuario.
 * El token se guarda en localStorage para sobrevivir a un refresh de página;
 * un signal en memoria permite que los componentes reaccionen a login/logout sin recargar.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  /** Usuario autenticado actual, o null si no hay sesión. Se lee al construir el servicio. */
  readonly currentUser = signal<User | null>(this.readUserFromStorage());

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        this.currentUser.set(response.data.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private readUserFromStorage(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
