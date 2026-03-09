import { Injectable, signal, computed, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MovieData, MovieItem } from '../models/movies.model';
import { GET_MOVIES, ADD_MOVIE, DELETE_MOVIE, DELETE_ALL_MOVIES } from '../graphql/movies.graphql';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private apollo = inject(Apollo);

  private _movies = signal<MovieItem[]>([]);
  private _isLoading = signal(false);

  // Expose readonly signals
  movies = this._movies.asReadonly();
  isLoading = this._isLoading.asReadonly();

  // Computed signal for total movies count
  moviesCount = computed(() => this._movies().length);
  deletingIds = computed(() => new Set(this._movies().filter((m: MovieItem) => m.isDeleting).map((m: MovieItem) => m.data.id)));

  private _moviesListWatchQuery = this.apollo.watchQuery<{ movies: MovieData[] }>({ query: GET_MOVIES });
  private _moviesAddMutation = (title: string) => this.apollo.mutate<{ addMovie: MovieData }>({
    mutation: ADD_MOVIE, variables: { title }, refetchQueries: [{ query: GET_MOVIES }]
  });
  private _moviesDeleteMutation = (id: string) => this.apollo.mutate<{ deleteMovie: boolean }>({
    mutation: DELETE_MOVIE, variables: { id }, refetchQueries: [{ query: GET_MOVIES }]
  });
  private _moviesDeleteAllMutation = () => this.apollo.mutate<{ deleteAllMovies: boolean }>({
    mutation: DELETE_ALL_MOVIES, refetchQueries: [{ query: GET_MOVIES }]
  });

  constructor() {
    this.loadMovies();
  }

  private loadMovies(): void {
    console.log('Loading movies...');
    this._isLoading.set(true);
    this._moviesListWatchQuery.valueChanges.subscribe({
      next: (result: { data?: { movies?: MovieData[] } }) => {
        console.log('Movies loaded successfully:', result.data?.movies?.length);
        const moviesData = result?.data?.movies;
        if (!moviesData) {
          this._isLoading.set(false);
          return;
        }
        this._movies.set(
          moviesData.map((data: MovieData): MovieItem => {
            return {
              data,
              searchTitle: data.title || '',
              isDeleting: false
            };
          })
        );
        this._isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('Error loading movies:', error);
        this._isLoading.set(false);
      },
    });
  }

  addMovie(title: string): void {
    if (title.trim() === '') return;
    this._isLoading.set(true);
    this._moviesAddMutation(title).subscribe({
      next: (result: { data?: { addMovie?: MovieData } }) => {
        console.log('Movie added successfully:', result.data?.addMovie);
      },
      error: (error: unknown) => {
        console.error('Error adding movie:', error);
        this._isLoading.set(false);
      },
    });
  }

  deleteMovie(movie: MovieItem): void {
    this._movies.update((current: MovieItem[]) =>
      current.map((it: MovieItem) =>
        it.data.id === movie.data.id ? { ...it, isDeleting: true } : it
      )
    );
    setTimeout(() => {
      this._moviesDeleteMutation(movie.data.id).subscribe({
        next: () => {
          this._movies.update((current) =>
            current.filter((it) => it.data.id !== movie.data.id)
          );
        },
        error: (err: unknown) => {
          console.error('Error deleting movie:', err);
          this._movies.update((current: MovieItem[]) =>
            current.map((it: MovieItem) =>
              it.data.id === movie.data.id ? { ...it, isDeleting: false } : it
            )
          );
        },
      });
    }, 300);
  }

  deleteAll(): void {
    this._isLoading.set(true);
    this._moviesDeleteAllMutation().subscribe({
      next: () => {
        this._movies.set([]);
        this._isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Error deleting all movies:', err);
        this._isLoading.set(false);
      },
    });
  }
}