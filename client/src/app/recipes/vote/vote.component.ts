import { Component, inject, input, output, signal } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../recipes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

type VoteType = 'like' | 'dislike';

@Component({
  selector: 'app-vote',
  standalone: true, // Ha még nem standalone
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss',
})
export class VoteComponent {
  private readonly recipesService = inject(RecipesService);

  readonly recipe = input.required<Recipe>();
  readonly isLoading = signal(false);
  readonly voteHappened = output<Recipe>();

  vote(reaction: VoteType) {
    if (this.isLoading()) return; // Prevent multiple clicks
    this.isLoading.set(true);

    this.recipesService[reaction === 'like' ? 'likeRecipe' : 'disLikeRecipe'](
      this.recipe()
    )
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (updatedRecipe) => this.voteHappened.emit(updatedRecipe),
        error: (error) => {
          console.error('Error voting:', error);
        },
      });
  }
}
