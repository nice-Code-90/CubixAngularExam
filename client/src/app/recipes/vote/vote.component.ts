import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../recipes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, tap } from 'rxjs';
import { LoadingComponent } from '../../shared/loading/loading.component';

type VoteType = 'like' | 'dislike';

@Component({
  imports: [LoadingComponent],
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss',
})
export class VoteComponent {
  private readonly recipesService = inject(RecipesService);

  readonly recipe = input.required<Recipe>();
  readonly isLoading = signal(false);
  readonly voteHappened = output<Recipe>();
  private readonly destroyRef = inject(DestroyRef);

  vote(reaction: VoteType) {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    this.recipesService[reaction === 'like' ? 'likeRecipe' : 'disLikeRecipe'](
      this.recipe()
    )
      .pipe(
        tap((updatedRecipe) => this.voteHappened.emit(updatedRecipe)),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        error: (error) => {
          console.error('Error voting:', error);
        },
      });
  }
}
