import { mastra } from "@/src/mastra";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { ingredients } = await req.json();
        const chefAgent = mastra.getAgent("chefAgent");
        const result = await chefAgent.generate(ingredients);

        let text = result.text;
        
        const corrections = {
            "Bonne appétit": "Bon appétit",
            "lbs": "kg",
            "pizzass": "pizzas",
            "grill de sec": "grill",
            "remettez-leur": "remettez-les",
            "toppingées": "garnies",
            "1 grand aubergine": "1 grande aubergine",
            "goat cheese": "fromage de chèvre",
            "Miel": "Miel",
            "Chavrie": "Fromage frais",
            "Fritters": "Beignets",
            "la miel": "le miel",
            "la aubergine": "l'aubergine",
            "un roux avec la crème": "une sauce avec la crème",
            "mélangé les pâtes": "mélanger les pâtes",
            "Pâte": "Pâtes",
            "Pâtess": "Pâtes",
            "riz... avec des pâtes": "riz", // Pour contrer son mélange bizarre
            "exactly": "exactement"
        };

        Object.entries(corrections).forEach(([key, value]) => {
            const regex = new RegExp(key, "gi");
            text = text.replace(regex, value);
        });

        // Correction manuelle des hallucinations de traduction fréquentes
        text = text.replace(/Ours d'amour/gi, "Huile d'olive");
        text = text.replace(/ours d'amour/gi, "huile d'olive");
        text = text.replace(/\*\*/g, ""); // Supprime les gras
        text = text.replace(/#/g, "");   // Supprime les hashtags
        text = text.replace(/---/g, "_________________________________");

        return NextResponse.json({ text });
    } catch (error) {
        return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
}