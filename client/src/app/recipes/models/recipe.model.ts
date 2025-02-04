export interface Recipe {
  id: string;
  title: string;
  description: string;
  picture?: string;
  userId: number;
  likes: number;
  ingredients: string[];
}
