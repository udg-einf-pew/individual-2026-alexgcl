import { gql } from '@apollo/client/core';
export const GET_MOVIES = gql`
    query GetMovies {
        movies {
            id
            title
            poster
            plot
            runtime
            director
            year
            actors
            imdbRating
            imdbId
            error
        }
    }
`;

export const ADD_MOVIE = gql`
    mutation AddMovie($title: String!) {
        addMovie(title: $title) {
            id
            title
            poster
            plot
            runtime
            director
            year
            actors
            imdbRating
            imdbId
            error
        }
    }
`;

export const DELETE_MOVIE = gql`
    mutation DeleteMovie($id: String!) {
        deleteMovie(id: $id)
    }
`;

export const DELETE_ALL_MOVIES = gql`
    mutation DeleteAllMovies {
        deleteAllMovies
    }
`;