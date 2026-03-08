import { Injectable, signal, computed, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MovieData, MovieItem } from '../models/movies.model';
import { GET_MOVIES, ADD_MOVIE } from '../graphql/movies.graphql';

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
  private _moviesListWatchQuery = this.apollo.watchQuery<{ movies: MovieData[] }>({ query:
  GET_MOVIES });
  private _moviesAddMutation = (title: string) => this.apollo.mutate<{ addMovie: MovieData }>({
  mutation: ADD_MOVIE, variables: { title }, refetchQueries: [{ query: GET_MOVIES }] });
  constructor() {
    this.loadMovies();
  }
  private loadMovies(): void {
  console.log('Loading movies...');
  this._isLoading.set(true);
  this._moviesListWatchQuery.valueChanges.subscribe({
  next: (result) => {
  console.log('Movies loaded successfully:', result.data?.movies?.length);
  const moviesData = result?.data?.movies;
  if (!moviesData) {
    this._isLoading.set(false);
    return;
  }
  this._movies.set(
  moviesData.map((data): MovieItem => {
    return {
    data,
    searchTitle: data.title || '',
    isDeleting: false
    };
  })
  );
  this._isLoading.set(false);
  },
  error: (error) => {
  console.error('Error loading movies:', error);
  this._isLoading.set(false);
  },
  });
  }
  addMovie(title: string): void {
    if (title.trim() === '') return;
    this._isLoading.set(true);
    this._moviesAddMutation(title)
    .subscribe({
    next: (result) => {
      console.log('Movie added successfully:', result.data?.addMovie);
    },
    error: (error) => {
      console.error('Error adding movie:', error);
      this._isLoading.set(false);
    },
    });
  }
  deleteMovie(movie: MovieItem): void {
    this._movies.update((current) =>
    current.map((it) =>
    it.data.id === movie.data.id ? { ...it, isDeleting: true } : it
    )
    );
    setTimeout(() => {
    //TODO
    }, 300);
  }
}