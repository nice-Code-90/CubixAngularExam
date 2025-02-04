import { Component, DestroyRef } from '@angular/core';
import { NewRecipe } from '../models/newRecipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-new-recipe',
  imports: [],
  templateUrl: './new-recipe.component.html',
  styleUrl: './new-recipe.component.scss',
})
export class NewRecipeComponent {
  newRecipe: NewRecipe = {
    title: '',
    description: '',
    picture: '',
    ingredients: [],
  };

  constructor(
    private readonly recipesService: RecipesService,

    private readonly destroyRef: DestroyRef
  ) {}

  save() {
    console.log(this.newRecipe);
  }
}
