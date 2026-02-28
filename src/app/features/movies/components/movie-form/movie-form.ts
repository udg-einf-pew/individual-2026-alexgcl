import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-movie-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.scss',
})
export class MovieForm {
  isLoading = input.required<boolean>();
  addMovieRequested = output<string>();

  onAdd(inputEl: HTMLInputElement): void {
    const titol = inputEl.value.trim();
    if (titol) {
      this.addMovieRequested.emit(titol);
      inputEl.value = '';
    }
  }
}
