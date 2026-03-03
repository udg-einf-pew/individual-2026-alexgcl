import { Movie } from '../types';

export class MoviesService {
    private movies: Movie[] = [];

    constructor() {
        this.loadInitialMovies();
    }

    private async loadInitialMovies(): Promise<void> {
    const initialMovies = [
        'Blade Runner',
        'The Silence of the Lambs',
        'Spirited Away',
        'Starship Troopers',
        'The Shawshank Redemption',
        'Thor',
    ];

    for (const title of initialMovies) {
        try {
            const newMovie = await this.fetchMovie(title);
            this.movies.push(newMovie);
        } catch (error) {
            const errorMovie = this.ErrorMovie(title, { error: "Failed to fetch movie data" });
            this.movies.push(errorMovie);
        }
    }
    }

    getMovies(): Movie[] {
        return this.movies;
    }

    async addMovie(title: string): Promise<Movie> {
        if (title.trim() === '') {
            throw new Error('Title cannot be empty');
        }
        try {
            const newMovie = await this.fetchMovie(title);
            this.movies.push(newMovie);
            return newMovie;
        } catch (error) {
            const errorMovie = this.ErrorMovie(title, { error: "Failed to fetch movie data" });
            this.movies.push(errorMovie);
            return errorMovie;
        }
    }
    deleteMovie(movieId: string): boolean {
        const initialLength = this.movies.length;
        this.movies = this.movies.filter((it) => it.id !== movieId);
        return this.movies.length < initialLength;
    }
    private ErrorMovie(title: string, data: Partial<Movie>): Movie {
        return {
            id: crypto.randomUUID(),
            title: title,
            ...data
        } as Movie;
    }
    private mapOmdbToMovie(omdbData: any): Movie {
        return {
            id: crypto.randomUUID(),
            title: omdbData.Title,
            poster: omdbData.Poster,
            plot: omdbData.Plot,
            runtime: omdbData.Runtime,
            director: omdbData.Director,
            year: omdbData.Year,
            actors: omdbData.Actors,
            imdbRating: omdbData.imdbRating,
            imdbId: omdbData.imdbID,
            error: omdbData.Error,
        };
    }
    private async fetchMovie(title: string): Promise<Movie> {
        const urlTitle = encodeURI(title);
        const response = await fetch(`https://www.omdbapi.com/?apikey=b0247a83&t=${urlTitle}`);
        const omdbData = await response.json();
        return this.mapOmdbToMovie(omdbData);
    }
}