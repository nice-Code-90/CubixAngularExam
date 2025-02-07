import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecipesService } from './recipes.service';

export const recipeResolver: ResolveFn<any> = (route, state) => {
  const recipeService = inject(RecipesService);

  const id = route.queryParamMap.get('id') ?? route.paramMap.get('id');

  if (id) {
    return recipeService.getRecipeById(id);
  } else {
    return undefined;
  }
};
