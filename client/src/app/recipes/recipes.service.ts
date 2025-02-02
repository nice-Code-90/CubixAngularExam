import { inject, Injectable } from '@angular/core';
import { Recipe } from './models/recipe.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor() {}
  private readonly BASE_URL = `${environment.baseUrl}/recipes`;
  private readonly IMAGE_BASE_URL = `${environment.baseUrl}/uploads/`;

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  listRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.BASE_URL).pipe(
      map((recipes) =>
        recipes.map((recipe) => {
          const picturePath = recipe.picture.startsWith('/uploads/')
            ? recipe.picture.substring(9)
            : recipe.picture;
          const picture = `${this.IMAGE_BASE_URL}${picturePath}`;
          return {
            ...recipe,
            picture,
          };
        })
      )
    );
  }

  likeRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.BASE_URL}/${recipe.id}/like`, null, {
      headers: this.authService.getAuthHeaders(),
    });
  }
  disLikeRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(
      `${this.BASE_URL}/${recipe.id}/disLike`,
      null,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  deleteRecipe(recipe: Recipe): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${this.BASE_URL}/${recipe.id}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
