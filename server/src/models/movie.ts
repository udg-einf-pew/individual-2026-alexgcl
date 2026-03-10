import { Schema, model } from 'mongoose';
import { Movie } from '../types';

const movieSchema = new Schema<Movie>({
  title: { type: String, required: true },
  poster: { type: String, required: true },
  plot: { type: String, required: true },
  director: { type: String, required: true },
  runtime: { type: String, required: true },
  year: { type: String, required: true },
  actors: { type: String, required: true },
  imdbRating: { type: Number, required: true },
  imdbId: { type: String, required: true }
}, {
  collection: 'movie',
  timestamps: true,
  toObject: {
    virtuals: true
  }
});

const MovieModel = model<Movie>('Movie', movieSchema);

export default MovieModel;
