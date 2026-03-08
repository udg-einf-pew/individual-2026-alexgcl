export interface MovieData {
  id: string;
  title: string;
  year: string;
  runtime: string;
  director: string;
  actors: string;
  imdbRating: string;
  plot: string;
  imdbID: string;
  poster: string;
}

export interface MovieItem {
  data: MovieData;
  searchTitle: string;
  isDeleting: boolean;
}