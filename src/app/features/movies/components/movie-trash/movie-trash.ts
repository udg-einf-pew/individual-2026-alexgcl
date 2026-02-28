import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-trash',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-trash.html',
  styleUrl: './movie-trash.scss',
})
export class MovieTrash {
  removeAllRequested = output<void>();
  removeMovieRequested = output<string>();

  onDragOver(ev: DragEvent): void {
    ev.preventDefault();
  }

  onDrop(ev: DragEvent): void {
    ev.preventDefault();
    const id = ev.dataTransfer?.getData('text/plain');
    if (id) {
      this.removeMovieRequested.emit(id);
    }
  }
}
