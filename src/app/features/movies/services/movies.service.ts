import { Injectable, signal, computed } from '@angular/core';
import { MovieItem } from '../models/movies.model';

const OMDB_API_KEY = 'e1e6eb54';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private _movies = signal<MovieItem[]>([]);
  private _isLoading = signal(false);
  private _deletingIds = signal<Set<string>>(new Set());

  movies = this._movies.asReadonly();
  isLoading = this._isLoading.asReadonly();
  deletingIds = this._deletingIds.asReadonly();
  moviesCount = computed(() => this._movies().length);

  async addMovie(title: string): Promise<void> {
    const titol = title.trim();
    if (!titol) return;

    this._isLoading.set(true);
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(titol)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === 'False') {
        alert('Pel·lícula no trobada');
        return;
      }

      const movie: MovieItem = {
        id: `item-${Date.now()}`,
        title: data.Title ?? '',
        year: data.Year ?? '',
        runtime: data.Runtime ?? '',
        director: data.Director ?? '',
        actors: data.Actors ?? '',
        imdbRating: data.imdbRating ?? '',
        plot: data.Plot ?? '',
        imdbID: data.imdbID ?? '',
        poster: data.Poster ?? '',
      };
      this._movies.update((list) => [...list, movie]);
    } catch {
      alert('Error amb la API');
    } finally {
      this._isLoading.set(false);
    }
  }

  deleteMovie(id: string): void {
    this._deletingIds.update((s) => new Set(s).add(id));
    setTimeout(() => {
      this._movies.update((list) => list.filter((m) => m.id !== id));
      this._deletingIds.update((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }, 300);
  }

  deleteAll(): void {
    const ids = this._movies().map((m) => m.id);
    ids.forEach((id) => this._deletingIds.update((s) => new Set(s).add(id)));
    setTimeout(() => {
      this._movies.set([]);
      this._deletingIds.set(new Set());
    }, 300);
  }
}
