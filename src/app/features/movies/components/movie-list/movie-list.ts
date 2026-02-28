import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MovieItem } from '../../models/movies.model';
import { CommonModule } from '@angular/common';
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
removeMovieRequested = output<MovieItem>();
onDeleteMovie(movie: MovieItem): void {
  this.removeMovieRequested.emit(movie);
}
}