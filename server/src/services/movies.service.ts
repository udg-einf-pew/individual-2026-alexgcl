import { Movie } from '../types';
import MovieModel from '../models/movie';

export class MoviesService {
    constructor() {
        // Ya no cargamos películas iniciales; los datos vienen de MongoDB
    }

    private mapDocToMovie(doc: unknown): Movie {
        const raw = doc as Record<string, unknown>;
        const obj =
            typeof raw?.toObject === 'function'
                ? (raw.toObject() as Record<string, unknown>)
                : raw;
        const id = obj?._id;
        const { _id, __v, ...rest } = obj ?? {};
        return {
            ...rest,
            id: id != null ? String(id) : '',
        } as Movie;
    }

    async getMovies(): Promise<Movie[]> {
        const docs = await MovieModel.find().exec();
        return docs.map((doc: unknown) => this.mapDocToMovie(doc));
    }

    async addMovie(title: string): Promise<Movie> {
        if (title.trim() === '') {
            throw new Error('Title cannot be empty');
        }

        const omdbData = await this.fetchOmdbMovie(title);
        if (omdbData.Error) {
            throw new Error(omdbData.Error || 'Failed to fetch movie data');
        }

        const movieData = this.mapOmdbToMovieData(omdbData);
        const newMovie = new MovieModel(movieData);
        const saved = await newMovie.save();
        return this.mapDocToMovie(saved);
    }

    async deleteMovie(movieId: string): Promise<boolean> {
        const result = await MovieModel.findByIdAndDelete(movieId).exec();
        return result != null;
    }

    async deleteAllMovies(): Promise<boolean> {
        const result = await MovieModel.deleteMany({}).exec();
        return (result?.deletedCount ?? 0) > 0;
    }

    private mapOmdbToMovieData(omdbData: {
        Title?: string;
        Poster?: string;
        Plot?: string;
        Director?: string;
        Runtime?: string;
        Year?: string;
        Actors?: string;
        imdbRating?: string;
        imdbID?: string;
    }): Record<string, unknown> {
        return {
            title: omdbData.Title ?? '',
            poster: omdbData.Poster ?? '',
            plot: omdbData.Plot ?? '',
            director: omdbData.Director ?? '',
            runtime: omdbData.Runtime ?? '',
            year: omdbData.Year ?? '',
            actors: omdbData.Actors ?? '',
            imdbRating: parseFloat(omdbData.imdbRating ?? '0') || 0,
            imdbId: omdbData.imdbID ?? '',
        };
    }

    private async fetchOmdbMovie(title: string): Promise<{
        Title?: string;
        Poster?: string;
        Plot?: string;
        Director?: string;
        Runtime?: string;
        Year?: string;
        Actors?: string;
        imdbRating?: string;
        imdbID?: string;
        Error?: string;
    }> {
        const urlTitle = encodeURI(title);
        const response = await (globalThis as unknown as { fetch: (url: string) => Promise<{ json: () => Promise<Record<string, unknown>> }> }).fetch(
            `https://www.omdbapi.com/?apikey=e1e6eb54&t=${urlTitle}`
        );
        return (await response.json()) as Awaited<ReturnType<MoviesService['fetchOmdbMovie']>>;
    }
}
