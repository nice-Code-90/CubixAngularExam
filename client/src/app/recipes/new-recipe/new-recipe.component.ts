import { Component, DestroyRef, signal } from '@angular/core';
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

@Component({
  selector: 'app-new-recipe',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './new-recipe.component.html',
  styleUrl: './new-recipe.component.scss',
})
export class NewRecipeComponent {
  newRecipeForm = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
    picture: new FormControl<File | null>(null),
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
  ) {}
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.pictureOfRecipe = inputElement.files[0];
      this.newRecipeForm.get('picture')?.setValue(this.pictureOfRecipe);
      this.newRecipeForm.get('picture')?.updateValueAndValidity();
    }
  }

  addIngredient() {
    if (this.certainIngredient.value) {
      this.ingredients.push(this.certainIngredient.value);
      this.newRecipeForm.get('ingredients')?.setValue(this.ingredients);
      this.certainIngredient.reset();
    }
  }

  removeIngredient(ingredient: string) {
    this.ingredients = this.ingredients.filter((ing) => ing !== ingredient);
    this.newRecipeForm.get('ingredients')?.setValue(this.ingredients);
  }

  save() {
    this.isLoading.set(true);
    const newRecipe: NewRecipe = {
      title: this.newRecipeForm.get('title')?.value!,
      description: this.newRecipeForm.get('description')?.value!,
      picture: this.pictureOfRecipe,
      ingredients: this.ingredients,
    };

    const formData = new FormData();
    formData.append('title', newRecipe.title);
    formData.append('description', newRecipe.description);
    if (newRecipe.picture) {
      formData.append('picture', newRecipe.picture);
    }
    formData.append('ingredients', JSON.stringify(newRecipe.ingredients));

    this.recipesService.createRecipe(formData).subscribe(
      () => {
        this.router.navigate(['/recipes']);
      },
      (error) => {
        console.error('Error saving recipe:', error);
      }
    );
  }
}
