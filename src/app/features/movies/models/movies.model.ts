export interface MovieData {
  id: string;
  title?: string;
  year?: string;
  runtime?: string;
  director?: string;
  actors?: string;
  imdbRating?: string;
  plot?: string;
  imdbID?: string;
  imdbId?: string;
  poster?: string;
  error?: string;
}

export interface MovieItem {
  data: MovieData;
  searchTitle: string;
  isDeleting: boolean;
}