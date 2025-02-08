import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../recipes.service';
import { switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalComponent } from '../../shared/modal/modal.component';
import { AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VoteComponent } from '../vote/vote.component';

@Component({
  selector: 'app-list-recipe',
  imports: [CommonModule, ModalComponent, RouterLink, VoteComponent],
  templateUrl: './list-recipe.component.html',
  styleUrl: './list-recipe.component.scss',
})
export class ListRecipeComponent implements AfterViewInit {
  private sanitizer = inject(DomSanitizer);
  private recipeToDelete?: Recipe;
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild('deleteModal') deleteModal!: ModalComponent;
  @ViewChild('errorModal') errorModal!: ModalComponent;

  getSafeUrl(base64: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(base64);
  }

  recipes = signal<Recipe[]>([]);

  private readonly recipeService = inject(RecipesService);

  constructor() {
    this.listRecipes().subscribe();
  }

  ngAfterViewInit(): void {
    if (!this.deleteModal) {
      console.error('deleteModal is not initialized');
    }
    if (!this.errorModal) {
      console.error('errorModal is not initialized');
    }
  }

  listRecipes() {
    return this.recipeService.listRecipes().pipe(
      tap((recipes) => this.recipes.set(recipes)),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  deleteRecipe() {
    if (this.recipeToDelete) {
      this.recipeService
        .deleteRecipe(this.recipeToDelete)
        .pipe(
          switchMap(() => this.listRecipes()),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: () => {
            console.log('Recipe deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting recipe:', error);
            if (this.errorModal) {
              this.errorModal.showModal();
            } else {
              console.error('Error modal not initialized');
            }
          },
        });
    }
  }

  confirmDelete(recipe: Recipe) {
    this.recipeToDelete = recipe;
    this.deleteModal.modalId = 'deleteModal';
    this.deleteModal.title = 'Confirm Delete';
    this.deleteModal.message = 'Are you sure you want to delete this recipe?';
    this.deleteModal.showModal();
  }
}
