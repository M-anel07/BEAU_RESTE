"use client";

import { useState, type FormEvent } from "react";

export type EtatPlacard = {
    ailOignon: boolean;
    cremeBeurre: boolean;
    bouillon: boolean;
    sauces: boolean;
};

export function useRefrigerateur() {
    const [currentIngredient, setCurrentIngredient] = useState("");
    const [frigo, setFrigo] = useState<string[]>([]);
    const [placard, setPlacard] = useState<EtatPlacard>({
        ailOignon: false,
        cremeBeurre: false,
        bouillon: false,
        sauces: false,
    });

    const ajouterIngredient = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        const parts = currentIngredient.split(",").map((s) => s.trim()).filter(Boolean);
        if (parts.length === 0) return;
        setFrigo((cur) => [...new Set([...cur, ...parts])]);
        setCurrentIngredient("");
    };

    const supprimerIngredient = (i: number) =>
        setFrigo((cur) => cur.filter((_, idx) => idx !== i));

    const viderFrigo = () => {
        setFrigo([]);
        setPlacard({ ailOignon: false, cremeBeurre: false, bouillon: false, sauces: false });
    };

    const loadDemo = () => {
        setFrigo(["tomate", "feta", "pâtes"]);
        setPlacard({ ailOignon: true, cremeBeurre: false, bouillon: false, sauces: false });
    };

    const getAllIngredients = () => {
        const basiques: string[] = [];
        if (placard.ailOignon) basiques.push("ail", "oignon");
        if (placard.cremeBeurre) basiques.push("crème fraîche", "beurre");
        if (placard.bouillon) basiques.push("bouillon cube");
        if (placard.sauces) basiques.push("moutarde", "ketchup");
        return [...new Set([...frigo, ...basiques])];
    };

    return {
        currentIngredient,
        setCurrentIngredient,
        frigo,
        setFrigo,
        placard,
        setPlacard,
        ajouterIngredient,
        supprimerIngredient,
        viderFrigo,
        loadDemo,
        getAllIngredients,
    };
}