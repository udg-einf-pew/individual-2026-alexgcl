import { Movie } from '../types';
import { MoviesService } from '../services/movies.service';
import { YogaInitialContext } from 'graphql-yoga';
import { GraphQLError } from 'graphql';

export class MoviesResolver {
    private moviesService: MoviesService;

    constructor() {
        this.moviesService = new MoviesService();
    }

    private requireAuth(ctx: YogaInitialContext & { jwt?: { payload?: { id?: string } } }): string {
        const jwtPayload = ctx.jwt?.payload;
        if (!jwtPayload || !jwtPayload.id) {
            throw new GraphQLError('Unauthorized: No valid token', { extensions: { http: { status: 401 } } });
        }
        return jwtPayload.id;
    }

    getResolvers() {
        return {
            Query: {
                movies: async (_parent: unknown, _args: unknown, ctx: YogaInitialContext & { jwt?: { payload?: { id?: string } } }): Promise<Movie[]> => {
                    const userId = this.requireAuth(ctx);
                    return this.moviesService.getMovies(userId);
                }
            },
            Mutation: {
                addMovie: async (_parent: unknown, args: { title: string }, ctx: YogaInitialContext & { jwt?: { payload?: { id?: string } } }): Promise<Movie> => {
                    const userId = this.requireAuth(ctx);
                    return this.moviesService.addMovie(userId, args.title);
                },
                deleteMovie: async (_parent: unknown, args: { id: string }, ctx: YogaInitialContext & { jwt?: { payload?: { id?: string } } }): Promise<boolean> => {
                    const userId = this.requireAuth(ctx);
                    return this.moviesService.deleteMovie(userId, args.id);
                },
                deleteAllMovies: async (_parent: unknown, _args: unknown, ctx: YogaInitialContext & { jwt?: { payload?: { id?: string } } }): Promise<boolean> => {
                    const userId = this.requireAuth(ctx);
                    return this.moviesService.deleteAllMovies(userId);
                }
            }
        };
    }
}