import { Movie } from '../types';
import MovieModel from '../models/movie';
import { Types, HydratedDocument } from 'mongoose';

export class MoviesService {
    constructor() {
        // Ja no carreguem pelicules inicials; les dades venen de MongoDB
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

    async getMovies(userId: string): Promise<Movie[]> {
        const docs = await MovieModel.find({ userId: new Types.ObjectId(userId) }).exec();
        return docs.map((doc: unknown) => this.mapDocToMovie(doc));
    }

    async addMovie(userId: string, title: string): Promise<Movie> {
        if (title.trim() === '') {
            throw new Error('Title cannot be empty');
        }
        try {
            const omdbData = await this.fetchOmdbMovie(title);
            if (omdbData.Error) {
                throw new Error(omdbData.Error || 'Failed to fetch movie data');
            }
            const newMovie = this.mapOmdbToMovieData(omdbData) as Record<string, unknown>;
            newMovie.userId = new Types.ObjectId(userId);
            const docMovie: HydratedDocument<Movie> = await MovieModel.create(newMovie);
            await docMovie.save();
            return this.mapDocToMovie(docMovie);
        } catch (error) {
            const errorMovie = this.errorMovie(title, { error: 'Failed to fetch movie data' });
            return errorMovie;
        }
    }

    private errorMovie(title: string, opts: { error?: string }): Movie {
        return {
            id: '',
            title,
            error: opts.error ?? 'Failed to fetch movie data'
        };
    }

    async deleteMovie(userId: string, movieId: string): Promise<boolean> {
        const result = await MovieModel.findOneAndDelete({
            _id: movieId,
            userId: new Types.ObjectId(userId)
        }).exec();
        return result != null;
    }

    async deleteAllMovies(userId: string): Promise<boolean> {
        const result = await MovieModel.deleteMany({ userId: new Types.ObjectId(userId) }).exec();
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
