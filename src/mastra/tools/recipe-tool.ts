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

        const res = await fetch(
            `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${inputData.ingredients}&number=10&ranking=1&ignorePantry=true&apiKey=${apiKey}`
        );

        const recipes = await res.json();

        // On filtre pour ne garder que les recettes où il manque maximum 3 ingrédients
        const filteredRecipes = recipes.filter((r: any) => r.missedIngredientCount <= 3);

        return filteredRecipes;
    },
});