// src/mastra/tools/recipe-tool.ts
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const recipeTool = createTool({
  id: 'get-recipes',
  description: 'Recherche des recettes basées sur les ingrédients du frigo',
  inputSchema: z.object({
    ingredients: z.string().describe('Liste des ingrédients'),
  }),
  execute: async (inputData) => {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const { ingredients } = inputData;

    const res = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=10&ranking=1&ignorePantry=true&apiKey=${apiKey}`
    );

    if (!res.ok) return "Aucune recette trouvée, improvise avec les ingrédients fournis.";

    const recipes = await res.json();
    const filtered = recipes.filter((r: any) => r.missedIngredientCount <= 3);

    if (filtered.length === 0) return "Aucune recette trouvée, improvise avec les ingrédients fournis.";

    // Retourne juste les noms — le modèle fait le reste
    return filtered.slice(0, 3).map((r: any) => r.title).join(", ");
  },
});