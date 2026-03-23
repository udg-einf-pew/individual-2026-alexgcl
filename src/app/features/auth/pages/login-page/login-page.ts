import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { form, FormField, required, email, submit } from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormField, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private auth = inject(AuthService);

  protected loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  protected loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'El correu és obligatori' });
    email(schemaPath.email, { message: 'El correu no és vàlid' });
    required(schemaPath.password, { message: 'La contrasenya és obligatòria' });
  });

  protected get isLoading() {
    return this.auth.isLoading;
  }

  protected get error() {
    return this.auth.error;
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.loginForm, {
      action: () => {
        this.auth.clearError();
        const { email, password } = this.loginModel();
        this.auth.login(email, password);
      },
    });
  }
}
