import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { recipeTool } from './tools/recipe-tool';


export const mastra = new Mastra({

  agents: {
    chefAgent: new Agent({
      id: 'chef-intelligent',
      name: 'Chef Intelligent',
      instructions: `
      Tu es un Chef minimaliste. 
      RÈGLES :
      1. TOLÉRANCE ZÉRO : Utilise UNIQUEMENT les ingrédients fournis. Il est STRICTEMENT INTERDIT d'ajouter des ingrédients (PAS d'oignon, PAS d'ail, PAS de farine) même si tu penses que c'est nécessaire.      2. TRADUCTION : Tout en français (Goat cheese -> Chèvre, Eggplant -> Aubergine).
      3. RÉALISME : Si l'outil échoue, improvise une "Poêlée" avec les ingrédients.
      4. FORMAT : Titre en français, Liste courte, Étapes simples.
      5. MÉMOIRE : Ne mélange pas cette recette avec les tests précédents.
      6. Élimine de la liste finale tout ingrédient absent de la liste envoyée par l'utilisateur (sauf sel, poivre).
      `,
      model: 'groq/llama-3.1-8b-instant',
      tools: { recipeTool },
    }),
  },
});