"use client";

import { useState, useEffect } from "react";

export type ElementHistorique = {
    ingredients: string[];
    recipe: string;
    titre: string;
};

const STORAGE_KEY = "beau-reste-history";

export function useHistorique() {
    const [history, setHistory] = useState<ElementHistorique[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setHistory(JSON.parse(saved));
        } catch { }
    }, []);

    const updateHistory = (newHistory: ElementHistorique[]) => {
        setHistory(newHistory);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    };

    const addToHistory = (item: ElementHistorique) =>
        updateHistory([item, ...history]);

    const supprimerHistorique = (i: number) =>
        updateHistory(history.filter((_, idx) => idx !== i));

    return { history, addToHistory, supprimerHistorique };
}