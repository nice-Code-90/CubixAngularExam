import { inject, Injectable } from '@angular/core';
import { Recipe } from './models/recipe.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NewRecipe } from './models/newRecipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly URL = `${environment.baseUrl}`;

  private addFullImageUrl(recipe: Recipe): Recipe {
    return {
      ...recipe,
      picture: recipe.picture ? `${this.URL}${recipe.picture}` : '',
    };
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http
      .get<Recipe>(`${this.URL}/recipes/${id}`)
      .pipe(map((recipe) => this.addFullImageUrl(recipe)));
  }

  listRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(`${this.URL}/recipes`)
      .pipe(
        map((recipes) => recipes.map((recipe) => this.addFullImageUrl(recipe)))
      );
  }

  likeRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http
      .put<Recipe>(`${this.URL}/recipes/${recipe.id}/like`, null, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(map((recipe) => this.addFullImageUrl(recipe)));
  }
  disLikeRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http
      .put<Recipe>(`${this.URL}/recipes/${recipe.id}/disLike`, null, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(map((recipe) => this.addFullImageUrl(recipe)));
  }

  deleteRecipe(recipe: Recipe) {
    return this.http.delete<{ id: string }>(
      `${this.URL}/recipes/${recipe.id}`,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  createRecipe(recipe: FormData) {
    const headers = this.authService.getAuthHeaders();

    return this.http.post<Recipe>(`${this.URL}/recipes`, recipe, { headers });
  }

  editRecipe(id: string, recipe: FormData) {
    const headers = this.authService.getAuthHeaders();

    return this.http.put<Recipe>(`${this.URL}/recipes/${id}`, recipe, {
      headers,
    });
  }
}
