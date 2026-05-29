import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const recipeTool = createTool({
  id: "get-recipes",
  description: "Recherche des recettes bas\xE9es sur les ingr\xE9dients du frigo",
  inputSchema: z.object({
    ingredients: z.string().describe("Liste des ingr\xE9dients")
  }),
  execute: async (inputData) => {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const res = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${inputData.ingredients}&number=10&ranking=1&ignorePantry=true&apiKey=${apiKey}`
    );
    const recipes = await res.json();
    const filteredRecipes = recipes.filter((r) => r.missedIngredientCount <= 3);
    return filteredRecipes;
  }
});

export { recipeTool };
