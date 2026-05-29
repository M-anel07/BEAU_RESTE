import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

"use strict";
const recipeTool = createTool({
  id: "get-recipes",
  description: "Recherche des recettes r\xE9elles bas\xE9es sur des ingr\xE9dients",
  inputSchema: z.object({
    ingredients: z.string().describe("Liste des ingr\xE9dients")
  }),
  // Correction : on reçoit directement les données (inputData)
  execute: async (inputData) => {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const res = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${inputData.ingredients}&number=5&ranking=1&apiKey=${apiKey}`
    );
    return res.json();
  }
});

"use strict";
const mastra = new Mastra({
  agents: {
    chefAgent: new Agent({
      id: "chef-intelligent",
      name: "Chef Intelligent",
      instructions: `        
                  Tu es un chef cuisinier STRICT. 
                  L'utilisateur ne peut PAS faire de courses.
                  1. Appelle l'outil "get-recipes".
                  2. Examine la liste des ingr\xE9dients de chaque recette.
                  3. Si la recette demande un ingr\xE9dient que l'utilisateur n'a pas (ex: farine, lait, oeufs), ignore-la.
                  4. Ne propose que des recettes r\xE9alisables \xE0 100%.`,
      model: "groq/llama-3.1-8b-instant",
      tools: {
        recipeTool
      },
      memory: new Memory({
        storage: new LibSQLStore({
          id: "mastra-memory-storage",
          url: "file:./mastra.db"
        }),
        options: {
          lastMessages: 20
        }
      })
    })
  }
});

export { mastra };
