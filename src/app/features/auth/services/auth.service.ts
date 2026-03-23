import { Injectable, signal, computed, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { User, RegisterInput } from '../models/auth.model';
import { REGISTER, LOGIN, LOGOUT, PROFILE } from '../graphql/auth.graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apollo = inject(Apollo);
  private router = inject(Router);

  private _user = signal<User | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  user = this._user.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();
  isLoggedIn = computed(() => this._user() !== null);

  constructor() {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.apollo
      .query<{ profile: User }>({ query: PROFILE })
      .subscribe({
        next: (result) => {
          if (result.data?.profile) {
            this._user.set(result.data.profile);
          } else {
            this._user.set(null);
          }
        },
        error: () => {
          this._user.set(null);
        },
      });
  }

  register(input: RegisterInput): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.apollo
      .mutate<{ register: boolean }>({
        mutation: REGISTER,
        variables: { user: input },
      })
      .subscribe({
        next: (result) => {
          if (result.data?.register) {
            this._isLoading.set(false);
            this.router.navigate(['/login']);
          }
        },
        error: (err: { message?: string; graphQLErrors?: Array<{ message?: string }> }) => {
          const msg = err.graphQLErrors?.[0]?.message ?? err.message ?? 'Error al registrar';
          this._error.set(msg);
          this._isLoading.set(false);
        },
      });
  }

  login(email: string, password: string): void {
    this._isLoading.set(true);
    this._error.set(null);
    this.apollo
      .mutate<{ login: boolean }>({
        mutation: LOGIN,
        variables: { email, password },
      })
      .subscribe({
        next: (result) => {
          if (result.data?.login) {
            this.loadProfile();
            this._isLoading.set(false);
            this.router.navigate(['/movies']);
          }
        },
        error: (err: { message?: string; graphQLErrors?: Array<{ message?: string }> }) => {
          const msg = err.graphQLErrors?.[0]?.message ?? err.message ?? 'Error al fer login';
          this._error.set(msg);
          this._isLoading.set(false);
        },
      });
  }

  logout(): void {
    this._isLoading.set(true);
    this.apollo
      .mutate<{ logout: boolean }>({ mutation: LOGOUT })
      .subscribe({
        next: () => {
          this._user.set(null);
          this._isLoading.set(false);
          this.router.navigate(['/movies']);
        },
        error: () => {
          this._user.set(null);
          this._isLoading.set(false);
          this.router.navigate(['/movies']);
        },
      });
  }

  clearError(): void {
    this._error.set(null);
  }
}
