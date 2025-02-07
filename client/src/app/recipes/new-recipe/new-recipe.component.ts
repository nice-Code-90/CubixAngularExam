import { Component, DestroyRef, Input, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RecipesService } from '../recipes.service';
import { CommonModule } from '@angular/common';
import { NewRecipe } from '../models/newRecipe.model';
import { Recipe } from '../models/recipe.model';
import { catchError, finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-new-recipe',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './new-recipe.component.html',
  styleUrl: './new-recipe.component.scss',
})
export class NewRecipeComponent implements OnInit {
  @Input({ required: false }) recipe?: Recipe;

  newRecipe = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
    picture: new FormControl<File | null>(null, [Validators.required]),
    ingredients: new FormControl<string[]>([], [Validators.required]),
  });

  certainIngredient: FormControl = new FormControl('', [Validators.required]);
  ingredients: string[] = [];
  pictureOfRecipe: File | null = null;
  isLoading = signal(false);

  constructor(
    private recipesService: RecipesService,
    private router: Router,
    private readonly destroyRef: DestroyRef
  ) {
    // this.newRecipe.valueChanges.subscribe()
    //For handle any tiny change in form values
  }
  ngOnInit(): void {
    if (this.recipe) {
      this.newRecipe.patchValue({
        title: this.recipe.title,
        description: this.recipe.description || '',
        //picture: this.recipe.picture || null,
        ingredients: this.recipe.ingredients || [],
      });
    }
    this.loadIngredients();
  }
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.pictureOfRecipe = inputElement.files[0];
    }
  }

  //for edit
  loadIngredients() {
    if (this.recipe?.ingredients) {
      this.ingredients = [...this.recipe.ingredients];
      this.newRecipe.get('ingredients')?.setValue(this.ingredients);
    }
  }

  addIngredient() {
    if (this.certainIngredient.value) {
      this.ingredients.push(this.certainIngredient.value);
      this.newRecipe.get('ingredients')?.setValue(this.ingredients);
      this.certainIngredient.reset();
    }
  }

  removeIngredient(ingredient: string) {
    this.ingredients = this.ingredients.filter((ing) => ing !== ingredient);
    this.newRecipe.get('ingredients')?.setValue(this.ingredients);
  }

  save() {
    this.isLoading.set(true);

    const formData = new FormData();
    formData.append('title', this.newRecipe.value.title!);
    formData.append('description', this.newRecipe.value.description!);

    if (this.pictureOfRecipe) {
      formData.append('picture', this.pictureOfRecipe);
    }
    formData.append('ingredients', JSON.stringify(this.ingredients));

    const operation = this.recipe
      ? this.recipesService.editRecipe(this.recipe.id, formData)
      : this.recipesService.createRecipe(formData);

    operation
      .pipe(
        tap(() => this.router.navigate(['/recipes'])),
        catchError((error) => {
          console.error('Error saving recipe:', error);
          throw error;
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
