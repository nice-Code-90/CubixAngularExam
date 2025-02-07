import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../models/recipe.model';
import { map, tap } from 'rxjs';
import { VoteComponent } from '../vote/vote.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe',
  imports: [VoteComponent],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private readonly recipeService = inject(RecipesService);

  getSafeUrl(base64: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(base64);
  }
  public recipe = signal<Recipe | undefined>(undefined);

  constructor() {
    this.activatedRoute.data
      .pipe(
        map((data) => data['recipe']),
        takeUntilDestroyed()
      )
      .subscribe((recipe) => this.recipe.set(recipe));
  }

  thankYouMessage: string = '';

  voteHappened(updatedRecipe: Recipe) {
    this.thankYouMessage = 'Thank you for voting';
    this.recipe.set(updatedRecipe);
  }
}
