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
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-recipe',
  imports: [CommonModule, ModalComponent, RouterLink, VoteComponent],
  templateUrl: './list-recipe.component.html',
  styleUrl: './list-recipe.component.scss',
})
export class ListRecipeComponent implements AfterViewInit {
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);
  private recipeToDelete?: Recipe;
  @ViewChild('modalWindow') modalWindow!: ModalComponent;
  private readonly router = inject(Router);

  modalConfig = {
    modalId: 'universalModal',
    title: '',
    message: '',
    showCloseButton: true,
    confirmButtonText: 'OK',
    currentAction: '',
  };

  getSafeUrl(base64: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(base64);
  }

  recipes = signal<Recipe[]>([]);

  private readonly recipeService = inject(RecipesService);

  constructor() {
    this.listRecipes().subscribe();
  }

  ngAfterViewInit(): void {
    if (!this.modalWindow) {
      console.error('deleteModal is not initialized');
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
            this.modalWindow.hideModal();
            this.showErrorModal();
          },
        });
    }
  }
  onModalConfirm() {
    switch (this.modalConfig.currentAction) {
      case 'delete':
        this.deleteRecipe();
        break;
      case 'error':
        this.modalWindow.hideModal();
        break;
      default:
        console.log('No action specified');
        break;
    }
  }

  showConfirmModal(recipe: Recipe) {
    this.recipeToDelete = recipe;
    this.modalConfig = {
      modalId: 'universalModal',
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this recipe?',
      showCloseButton: true,
      confirmButtonText: 'Delete',
      currentAction: 'delete',
    };
    this.modalWindow.showModal();
  }
  showErrorModal() {
    this.modalConfig = {
      modalId: 'universalModal',
      title: 'Error',
      message: 'You are not authorized to delete this recipe',
      showCloseButton: false,
      confirmButtonText: 'OK',
      currentAction: 'error',
    };
    this.modalWindow.showModal();
  }

  checkRecipeOwnership(recipe: Recipe) {
    this.recipeService.checkRecipeOwnership(recipe.id).subscribe({
      next: (isOwner) => {
        if (isOwner) {
          this.router.navigate(['/recipes/new'], {
            queryParams: { id: recipe.id },
          });
        } else {
          this.modalConfig = {
            modalId: 'universalModal',
            title: 'Access Denied',
            message: 'You can only edit recipes that you created.',
            showCloseButton: false,
            confirmButtonText: 'OK',
            currentAction: 'error',
          };
          this.modalWindow.showModal();
        }
      },
      error: (error) => {
        console.error('Error checking recipe ownership:', error);
        this.modalConfig = {
          modalId: 'universalModal',
          title: 'Error',
          message: 'An error occurred while checking recipe ownership.',
          showCloseButton: false,
          confirmButtonText: 'OK',
          currentAction: 'error',
        };
        this.modalWindow.showModal();
      },
    });
  }
}
