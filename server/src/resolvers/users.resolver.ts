import { UserModel } from '../models/user';
import { User } from '../types';
import { sign } from 'jsonwebtoken';
import { YogaInitialContext } from 'graphql-yoga';
import { comparePassword, JWT_COOKIE_NAME, JWT_EXPIRY, JWT_SECRET } from '../secure';
import { GraphQLError } from 'graphql';

function generateToken(user: User): string {
    if (!user) return '';
    return sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
}

export class UsersResolver {
    getResolvers() {
        return {
            Query: {
                profile: async (_parent: unknown, _args: unknown, ctx: YogaInitialContext & { jwt?: any }):
                Promise<User | null> => {
                    const jwtPayload = ctx.jwt?.payload;
                    if (!jwtPayload || !jwtPayload.id) {
                        throw new GraphQLError('Unauthorized: No valid token', { extensions: { http: { status: 401 } } });
                    }
                    const user = await UserModel.findById(jwtPayload.id);
                    if (!user) {
                        throw new GraphQLError('User not found', { extensions: { http: { status: 404 } } });
                    }

                    return user;
                }
            },
            Mutation: {
                login: async (_parent: unknown, args: { email: string; password: string }, ctx: YogaInitialContext): 
                Promise<boolean> => {
                    const user: User | null = await UserModel.findOne({ email: args.email }).select('+password');
                    if (!user || !(await comparePassword(args.password, user.password))) {
                        throw new GraphQLError('Invalid email or password', { extensions: { http: { status: 400 } } });
                    }
                    const token = generateToken(user);
                    if (ctx.request.cookieStore) {
                        const expiryDate = new Date();
                        expiryDate.setSeconds(expiryDate.getSeconds() + JWT_EXPIRY);
                        await ctx.request.cookieStore.set({
                            name: JWT_COOKIE_NAME,
                            value: token,
                            httpOnly: true,
                            //secure: true,
                            sameSite: 'strict',
                            path: '/',
                            expires: expiryDate,
                            domain: null
                        });
                    }
                    return true;
                },
                logout: async (_parent: unknown, _args: unknown, ctx: YogaInitialContext): Promise<boolean> => {
                    if (ctx.request.cookieStore) {
                        await ctx.request.cookieStore.delete(JWT_COOKIE_NAME);
                    }
                    return true;
                },
                register: async (_parent: unknown, args: { user: User }): Promise<boolean> => {
                    try {
                        const existingUser = await UserModel.findOne({ email: args.user.email });
                        if (existingUser) {
                            throw new GraphQLError('Email already registered', { extensions: { http: { status: 400 } } });
                        }
                        const newUser = await UserModel.create({
                            name: args.user.name,
                            email: args.user.email,
                            password: args.user.password,
                            passwordConfirmation: args.user.passwordConfirmation,
                            role: 'user'
                        });
                        return !!newUser;
                    } catch (error: any) {
                        throw new GraphQLError(`Registration failed: ${error.message}`, {
                            extensions: { http: { status: 500 } }
                        });
                    }
                }
            }
        }
    }
}
