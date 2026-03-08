import { Injectable, signal, computed, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
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
  next: (result: ApolloQueryResult<{ movies: MovieData[] }>) => {
  console.log('Movies loaded successfully:', result.data?.movies?.length);
  const moviesData = result?.data?.movies as MovieData[] | undefined;
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
  error: (err: unknown) => {
  console.error('Error loading movies:', err);
  this._isLoading.set(false);
  },
  });
  }
  addMovie(title: string): void {
    if (title.trim() === '') return;
    this._isLoading.set(true);
    this._moviesAddMutation(title).subscribe({
      next: (result: { data?: { addMovie: MovieData } }) => {
        this._isLoading.set(false);
        const newMovie = result.data?.addMovie;
        if (newMovie) {
          this._movies.update((current) => [
            ...current,
            {
              data: newMovie,
              searchTitle: newMovie.title || '',
              isDeleting: false,
            },
          ]);
        }
      },
      error: (err: unknown) => {
        console.error('Error adding movie:', err);
        this._isLoading.set(false);
      },
    });
  }
  deleteMovie(movie: MovieItem): void {
    const id = movie.data.id;
    this._movies.update((current) =>
      current.map((it) =>
        it.data.id === id ? { ...it, isDeleting: true } : it
      )
    );
    setTimeout(() => {
      this._moviesDeleteMutation(id).subscribe({
        next: () => {
          this._movies.update((current) => current.filter((it) => it.data.id !== id));
        },
        error: (err: unknown) => {
          console.error('Error deleting movie:', err);
          this._movies.update((current) =>
            current.map((it) => (it.data.id === id ? { ...it, isDeleting: false } : it))
          );
        },
      });
    }, 300);
  }

  deleteAll(): void {
    const current = this._movies();
    if (current.length === 0) return;
    this._movies.update((list) => list.map((it) => ({ ...it, isDeleting: true })));
    const durationMs = 400;
    setTimeout(() => {
      this._moviesDeleteAllMutation().subscribe({
        next: () => {
          this._movies.set([]);
        },
        error: (err: unknown) => {
          console.error('Error deleting all movies:', err);
          this._movies.update((list) => list.map((it) => ({ ...it, isDeleting: false })));
        },
      });
    }, durationMs);
  }
}