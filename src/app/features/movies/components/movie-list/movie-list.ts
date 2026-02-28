import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MovieItem } from '../../models/movies.model';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-movie-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MovieCard],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList {
  movies = input.required<MovieItem[]>();
  deletingIds = input.required<Set<string>>();
  removeMovieRequested = output<MovieItem>();

  onDeleteMovie(movie: MovieItem): void {
    this.removeMovieRequested.emit(movie);
  }

  onDragStart(ev: DragEvent, movie: MovieItem): void {
    ev.dataTransfer?.setData('text/plain', movie.id);
  }
}
