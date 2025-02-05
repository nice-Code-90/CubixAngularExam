import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RecipesService } from '../recipes.service';
import { CommonModule } from '@angular/common';

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

  ingredientControl: FormControl = new FormControl('');
  ingredients: string[] = [];
  selectedFile: File | null = null;

  constructor(private recipesService: RecipesService, private router: Router) {}
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  addIngredient() {
    if (this.ingredientControl.value) {
      this.ingredients.push(this.ingredientControl.value);
      this.newRecipeForm.get('ingredients')?.setValue(this.ingredients);
      this.ingredientControl.reset();
    }
  }

  removeIngredient(ingredient: string) {
    this.ingredients = this.ingredients.filter((ing) => ing !== ingredient);
    this.newRecipeForm.get('ingredients')?.setValue(this.ingredients);
  }

  saveRecipe() {
    if (this.newRecipeForm.valid && this.selectedFile) {
      const formData = new FormData();
      const formValues: { [key: string]: any } = this.newRecipeForm.value;

      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          const value = formValues[key];
          if (key === 'ingredients') {
            formData.append(key, JSON.stringify(this.ingredients));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value as string);
          }
        }
      }

      formData.append('picture', this.selectedFile);

      this.recipesService.createRecipe(formData).subscribe(
        () => {
          this.router.navigate(['/recipes']);
        },
        (error) => {
          console.error('Error saving recipe:', error);
        }
      );
    } else {
      console.error('Form is invalid or file is not selected');
    }
  }
}
