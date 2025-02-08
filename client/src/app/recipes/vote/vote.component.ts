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
import { finalize, takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-vote',
  imports: [],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss',
})
export class VoteComponent {
  private readonly recipesService = inject(RecipesService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly recipe = input.required<Recipe>();
  public readonly isLoading = signal(false);

  public readonly voteHappened = output<Recipe>();

  public vote(reaction: 'like' | 'dislike') {
    this.isLoading.set(true);
    const observable =
      reaction === 'like'
        ? this.recipesService.likeRecipe(this.recipe())
        : this.recipesService.disLikeRecipe(this.recipe());

    observable
      .pipe(
        tap((updatedRecipe) => this.voteHappened.emit(updatedRecipe)),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
