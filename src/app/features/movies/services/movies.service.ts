import { Injectable, signal, computed } from '@angular/core';
import { MovieItem } from '../models/movies.model';
@Injectable({
 providedIn: 'root',
})
export class MoviesService {
 private _movies = signal<MovieItem[]>([]);
 private _isLoading = signal(false);
 // Expose readonly signals
 movies = this._movies.asReadonly();
 isLoading = this._isLoading.asReadonly();
 // Computed signal for total movies count
 moviesCount = computed(() => this._movies().length);
 addMovie(title: string): Promise<void> {
 return new Promise((resolve) => resolve());
 }
 deleteMovie(movie: MovieItem): void {
 }
}