import { Route } from '@angular/router';
import { ListRecipeComponent } from './list-recipe/list-recipe.component';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';
import { recipeResolver } from './recipe.resolver';

export const routes: Route[] = [
  {
    path: '',
    component: ListRecipeComponent,
  },
  {
    path: 'new',
    resolve: { recipe: recipeResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    component: NewRecipeComponent,
  },
];
