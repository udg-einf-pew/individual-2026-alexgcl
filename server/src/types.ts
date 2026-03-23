import { Types } from 'mongoose';

export interface Movie {
    id: string;
    userId?: Types.ObjectId;
    title?: string;
    poster?: string;
    plot?: string;
    runtime?: string;
    director?: string;
    year?: string;
    actors?: string;
    imdbRating?: string;
    imdbId?: string;
    error?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    password?: string;
    passwordConfirmation?: string;
}