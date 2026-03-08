import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieForm } from '../../components/movie-form/movie-form';
import { MovieTrash } from '../../components/movie-trash/movie-trash';
import { MovieList } from '../../components/movie-list/movie-list';
import { MoviesService } from '../../services/movies.service';
import { MovieItem } from '../../models/movies.model';

@Component({
  selector: 'app-movies-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MovieForm, MovieTrash, MovieList],
  templateUrl: './movies-page.html',
  styleUrl: './movies-page.scss',
})
export class MoviesPage {
  private moviesService = inject(MoviesService);

  get movies() {
    return this.moviesService.movies;
  }
  get isLoading() {
    return this.moviesService.isLoading;
  }
  get moviesCount() {
    return this.moviesService.moviesCount;
  }
  get deletingIds() {
    return this.moviesService.deletingIds;
  }

  addMovie(title: string): void {
    this.moviesService.addMovie(title);
  }

  deleteMovie(movie: MovieItem): void {
    this.moviesService.deleteMovie(movie);
  }

  deleteMovieById(id: string): void {
    const movie = this.movies().find((m) => m.data.id === id);
    if (movie) this.moviesService.deleteMovie(movie);
  }

  deleteAll(): void {
    this.moviesService.deleteAll();
  }
}
