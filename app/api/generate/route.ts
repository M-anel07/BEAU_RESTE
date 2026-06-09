import { mastra } from "@/src/mastra";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { ingredients, pantry } = await req.json();
        const chefAgent = mastra.getAgent("chefAgent");

        let result;
        for (let i = 0; i < 3; i++) {
            try {
                result = await chefAgent.generate([
                    {
                        role: "user",
                        content: `Ingrédients disponibles : ${ingredients}${pantry?.length ? `\nFond de placard : ${pantry.join(", ")}` : ""
                            }`,
                    },
                ]);
                break;
            } catch (e: any) {
                if (i === 2) throw e;
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        let text = result?.text ?? "";

        if (!text) {
            return NextResponse.json(
                { error: "L'agent n'a pas produit de réponse" },
                { status: 500 }
            );
        }

        text = text.replace(/\*\*/g, "");
        text = text.replace(/#/g, "");
        text = text.replace(/---/g, "_________________________________");

        return NextResponse.json({ text });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}