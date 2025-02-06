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
  recipe: any;

  constructor(
    private recipesService: RecipesService,
    private router: Router,
    private readonly destroyRef: DestroyRef
  ) {
    // this.newRecipe.valueChanges.subscribe()
    //For handle any tiny change in form values
  }
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.pictureOfRecipe = inputElement.files[0];
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
    // const newRecipe: NewRecipe = {
    //   title: this.newRecipeForm.get('title')?.value!,
    //   description: this.newRecipeForm.get('description')?.value!,
    //   picture: this.pictureOfRecipe,
    //   ingredients: this.ingredients,
    // };

    const formData = new FormData();
    formData.append('title', this.newRecipe.value.title!);
    formData.append('description', this.newRecipe.value.description!);

    if (this.pictureOfRecipe) {
      formData.append('picture', this.newRecipe.value.picture!);
    }
    formData.append('ingredients', JSON.stringify(this.ingredients));

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
