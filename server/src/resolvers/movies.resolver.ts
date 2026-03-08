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
                movies: (): Movie[] => {
                    try {
                        return this.moviesService.getMovies() ?? []
                    } catch (err) {
                        console.error('getMovies error:', err)
                        return []
                    }
                }
            },
            Mutation: {
                addMovie: async (_parent: unknown, args: { title: string }): Promise<Movie> => {
                    try {
                        return await this.moviesService.addMovie(args?.title ?? '')
                    } catch (err) {
                        console.error('addMovie error:', err)
                        throw err
                    }
                },
                deleteMovie: (_parent: unknown, args: { id: string }): boolean =>
                    this.moviesService.deleteMovie(args.id),
                deleteAllMovies: (): boolean =>
                    this.moviesService.deleteAllMovies()
            }
        }
    }
}
