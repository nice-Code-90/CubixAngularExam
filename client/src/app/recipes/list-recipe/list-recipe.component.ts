import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';
import {
  Component,
  AfterViewInit,
  inject,
  DestroyRef,
  ViewChild,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterLink, Router } from '@angular/router';
import { tap, switchMap, catchError, EMPTY } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../recipes.service';
import { VoteComponent } from '../vote/vote.component';

interface ModalConfig {
  modalId: string;
  title: string;
  message: string;
  showCloseButton: boolean;
  confirmButtonText: string;
  currentAction: ModalAction;
}

type ModalAction = 'delete' | 'error' | '';

@Component({
  selector: 'app-list-recipe',
  imports: [CommonModule, ModalComponent, RouterLink, VoteComponent],
  templateUrl: './list-recipe.component.html',
  styleUrl: './list-recipe.component.scss',
})
export class ListRecipeComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly recipeService = inject(RecipesService);

  @ViewChild('modalWindow') private modalWindow!: ModalComponent;

  private recipeToDelete?: Recipe;
  readonly recipes = signal<Recipe[]>([]);

  private readonly MODAL_CONFIGS: Record<string, ModalConfig> = {
    DELETE_CONFIRM: {
      modalId: 'universalModal',
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this recipe?',
      showCloseButton: true,
      confirmButtonText: 'Delete',
      currentAction: 'delete',
    },
    ERROR: {
      modalId: 'universalModal',
      title: 'Error',
      message: 'You are not authorized to delete this recipe',
      showCloseButton: false,
      confirmButtonText: 'OK',
      currentAction: 'error',
    },
    ACCESS_DENIED: {
      modalId: 'universalModal',
      title: 'Access Denied',
      message: 'You can only edit recipes that you have created.',
      showCloseButton: false,
      confirmButtonText: 'OK',
      currentAction: 'error',
    },
    OWNERSHIP_ERROR: {
      modalId: 'universalModal',
      title: 'Error',
      message: 'Please log in for change recpie.',
      showCloseButton: false,
      confirmButtonText: 'OK',
      currentAction: 'error',
    },
  };

  modalConfig: ModalConfig = {
    modalId: 'universalModal',
    title: '',
    message: '',
    showCloseButton: true,
    confirmButtonText: 'OK',
    currentAction: '',
  };

  constructor() {
    this.initializeRecipes();
  }

  getSafeUrl(base64: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(base64);
  }

  private initializeRecipes(): void {
    this.listRecipes().subscribe();
  }

  listRecipes() {
    return this.recipeService.listRecipes().pipe(
      tap((recipes) => this.recipes.set(recipes)),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  deleteRecipe() {
    if (!this.recipeToDelete) return;

    this.recipeService
      .deleteRecipe(this.recipeToDelete)
      .pipe(
        tap(() => console.log('Recipe deleted successfully')),
        switchMap(() => this.listRecipes()),
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error('Error deleting recipe:', error);
          this.handleModalError();
          return EMPTY;
        })
      )
      .subscribe();
  }

  onModalConfirm() {
    const actions: Record<ModalAction, () => void> = {
      delete: () => this.deleteRecipe(),
      error: () => this.modalWindow.hideModal(),
      '': () => console.log('No action specified'),
    };

    const action = actions[this.modalConfig.currentAction];
    action?.();
  }

  showConfirmModal(recipe: Recipe) {
    this.recipeToDelete = recipe;
    this.showModal(this.MODAL_CONFIGS['DELETE_CONFIRM']);
  }

  private handleModalError(): void {
    this.modalWindow.hideModal();
    this.showModal(this.MODAL_CONFIGS['ERROR']);
  }

  private showModal(config: ModalConfig): void {
    this.modalConfig = config;
    this.modalWindow.showModal();
  }

  checkRecipeOwnership(recipe: Recipe) {
    if (!recipe?.id) return;

    this.recipeService
      .checkRecipeOwnership(recipe.id)
      .pipe(
        tap((isOwner) => {
          if (isOwner) {
            this.navigateToEditRecipe(recipe.id);
          } else {
            this.showModal(this.MODAL_CONFIGS['ACCESS_DENIED']);
          }
        }),
        catchError((error) => {
          console.error('Error checking recipe ownership:', error);
          this.showModal(this.MODAL_CONFIGS['OWNERSHIP_ERROR']);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private navigateToEditRecipe(recipeId: string): void {
    this.router.navigate(['/recipes/new'], {
      queryParams: { id: recipeId },
    });
  }
}
