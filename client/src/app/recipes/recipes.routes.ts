import { Route } from '@angular/router';
import { ListRecipeComponent } from './list-recipe/list-recipe.component';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';

export const routes: Route[] = [
  {
    path: '',
    component: ListRecipeComponent,
  },
  {
    path: 'new',
    component: NewRecipeComponent,
  },
];
