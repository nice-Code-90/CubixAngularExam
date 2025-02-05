export interface NewRecipe {
  title: string;
  description: string;
  picture: File | null;
  ingredients: string[];
}
