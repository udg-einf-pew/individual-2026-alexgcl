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
        const t = typeof title === 'string' ? title.trim() : '';
        if (t === '') {
            const errorMovie = this.ErrorMovie('', { error: 'Title cannot be empty' });
            return errorMovie;
        }
        const newMovie = await this.fetchMovie(t);
        this.movies.push(newMovie);
        return newMovie;
    }
    deleteMovie(movieId: string): boolean {
        const initialLength = this.movies.length;
        this.movies = this.movies.filter((it) => it.id !== movieId);
        return this.movies.length < initialLength;
    }

    deleteAllMovies(): boolean {
        const hadMovies = this.movies.length > 0;
        this.movies = [];
        return hadMovies;
    }
    private ErrorMovie(title: string, data: Partial<Movie>): Movie {
        return {
            id: crypto.randomUUID(),
            title: title,
            ...data
        } as Movie;
    }
    private mapOmdbToMovie(omdbData: Record<string, unknown> | null | undefined): Movie {
        const o = omdbData ?? {};
        return {
            id: crypto.randomUUID(),
            title: typeof o.Title === 'string' ? o.Title : undefined,
            poster: typeof o.Poster === 'string' ? o.Poster : undefined,
            plot: typeof o.Plot === 'string' ? o.Plot : undefined,
            runtime: typeof o.Runtime === 'string' ? o.Runtime : undefined,
            director: typeof o.Director === 'string' ? o.Director : undefined,
            year: typeof o.Year === 'string' ? o.Year : undefined,
            actors: typeof o.Actors === 'string' ? o.Actors : undefined,
            imdbRating: typeof o.imdbRating === 'string' ? o.imdbRating : undefined,
            imdbId: typeof o.imdbID === 'string' ? o.imdbID : undefined,
            error: typeof o.Error === 'string' ? o.Error : undefined,
        };
    }
    private async fetchMovie(title: string): Promise<Movie> {
        const urlTitle = encodeURIComponent(title);
        try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=e1e6eb54&t=${urlTitle}`);
            const raw = await response.text();
            let omdbData: Record<string, unknown> | null = null;
            try {
                omdbData = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
            } catch {
                return this.ErrorMovie(title, { error: 'Invalid response from movie API' });
            }
            if (!response.ok) {
                return this.ErrorMovie(title, { error: `Movie API error: ${response.status}` });
            }
            return this.mapOmdbToMovie(omdbData);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch movie data';
            return this.ErrorMovie(title, { error: message });
        }
    }
}