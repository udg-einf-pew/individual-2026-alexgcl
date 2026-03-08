import { Movie } from '../types'
import { MoviesService } from '../services/movies.service'

export class MoviesResolver {
    private moviesService: MoviesService
    constructor() {
        this.moviesService = new MoviesService()
    }
    getResolvers() {
        return {
            Query: {
                movies: (): Movie[] => this.moviesService.getMovies()
            },
            Mutation: {
                addMovie: async (_parent: unknown, args: { title: string }): Promise<Movie> =>
                    await this.moviesService.addMovie(args?.title ?? ''),
                deleteMovie: (_parent: unknown, args: { id: string }): boolean =>
                    this.moviesService.deleteMovie(args.id),
                deleteAllMovies: (): boolean =>
                    this.moviesService.deleteAllMovies()
            }
        }
    }
}
