import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  form,
  FormField,
  required,
  email,
  minLength,
  validate,
  submit,
} from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

@Component({
  selector: 'app-register-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormField, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  private auth = inject(AuthService);

  protected registerModel = signal<RegisterData>({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  protected registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.name, { message: 'El nom és obligatori' });
    required(schemaPath.email, { message: 'El correu és obligatori' });
    email(schemaPath.email, { message: 'El correu no és vàlid' });
    required(schemaPath.password, { message: 'La contrasenya és obligatòria' });
    minLength(schemaPath.password, 8, {
      message: 'La contrasenya ha de tenir com a mínim 8 caràcters',
    });
    required(schemaPath.passwordConfirmation, {
      message: 'Cal confirmar la contrasenya',
    });
    validate(schemaPath.passwordConfirmation, ({ value, valueOf }) => {
      const confirm = value();
      const pass = valueOf(schemaPath.password);
      if (confirm !== pass) {
        return { kind: 'passwordMismatch', message: 'Les contrasenyes no coincideixen' };
      }
      return null;
    });
  });

  protected get isLoading() {
    return this.auth.isLoading;
  }

  protected get error() {
    return this.auth.error;
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.registerForm, async () => {
      this.auth.clearError();
      const input = this.registerModel();
      this.auth.register(input);
    });
  }
}
