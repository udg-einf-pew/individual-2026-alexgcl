import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MovieItem } from '../../models/movies.model';
import { CommonModule } from '@angular/common';
@Component({
selector: 'app-movie-trash',
changeDetection: ChangeDetectionStrategy.OnPush,
standalone: true,
imports: [CommonModule],
templateUrl: './movie-trash.html',
styleUrl: './movie-trash.scss',
})
export class MovieTrash {
removeMovieRequested = output<MovieItem>();
}