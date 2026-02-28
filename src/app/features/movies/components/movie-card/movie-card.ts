import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MovieItem } from '../../models/movies.model';
import { CommonModule } from '@angular/common';
@Component({
selector: 'app-movie-card',
changeDetection: ChangeDetectionStrategy.OnPush,
standalone: true,
imports: [CommonModule],
templateUrl: './movie-card.html',
styleUrl: './movie-card.scss',
})
export class MovieCard {
movieItem = input.required<MovieItem>();
}
