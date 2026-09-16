"use client";

import { useState, type FormEvent } from "react";

export function useRefrigerateur() {
    const [currentIngredient, setCurrentIngredient] = useState("");
    const [frigo, setFrigo] = useState<string[]>([]);

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
    };

    const loadDemo = () => {
        setFrigo(["tomate", "feta", "pâtes"]);
    };

    return {
        currentIngredient,
        setCurrentIngredient,
        frigo,
        setFrigo,
        ajouterIngredient,
        supprimerIngredient,
        viderFrigo,
        loadDemo,
    };
}