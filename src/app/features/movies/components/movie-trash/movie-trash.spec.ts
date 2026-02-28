import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieTrash } from './movie-trash';

describe('MovieTrash', () => {
  let component: MovieTrash;
  let fixture: ComponentFixture<MovieTrash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieTrash],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieTrash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
