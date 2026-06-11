"use client";

import { useState } from "react";

export function useGenerationRecette() {
    const [reponse, setReponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [copie, setCopie] = useState(false);

    const generate = async (ingredients: string[]) => {
        if (ingredients.length === 0) return null;
        setLoading(true);
        setReponse("");

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients }),
            });
            if (!res.ok) throw new Error("Request failed");
            const data = await res.json();
            const text = typeof data.text === "string" ? data.text : "Réponse indisponible.";
            const titreMatch = text.match(/^titre\s*:\s*(.+)/im);
            const titre = titreMatch ? titreMatch[1].trim() : "Recette";
            setReponse(text);
            return { text, titre };
        } catch {
            setReponse("Erreur technique.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const copierRecette = async () => {
        if (!reponse) return;
        try {
            await navigator.clipboard.writeText(reponse);
            setCopie(true);
            setTimeout(() => setCopie(false), 2000);
        } catch (err) {
            console.error("Erreur de copie :", err);
        }
    };

    const reset = () => setReponse("");

    return { reponse, setReponse, loading, copie, generate, copierRecette, reset };
}