import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../models/recipe.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { VoteComponent } from '../vote/vote.component';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [VoteComponent],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  readonly recipe = signal<Recipe | undefined>(undefined);
  readonly thankYouMessage = signal<string>('');

  constructor() {
    this.initializeRecipe();
  }

  private initializeRecipe(): void {
    this.route.data
      .pipe(takeUntilDestroyed())
      .subscribe(({ recipe }) => this.recipe.set(recipe));
  }

  getSafeUrl(base64: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(base64);
  }

  voteHappened(updatedRecipe: Recipe): void {
    this.thankYouMessage.set('Thank you for voting');
    this.recipe.set(updatedRecipe);
  }
}
