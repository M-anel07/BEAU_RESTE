"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import Link from "next/link";
import RecipeCard from "../components/recipe-card";
import Footer from "../components/footer";

type HistoryItem = {
    ingredients: string[];
    recipe: string;
    titre: string;
    isFavorite?: boolean;
};

export default function HistoriquePage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<HistoryItem | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
    const [confirmerTout, setConfirmerTout] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("beau-reste-history");
            if (saved) setHistory(JSON.parse(saved));
        } catch { }
    }, []);

    useEffect(() => {
        document.body.style.overflow = selectedRecipe ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [selectedRecipe]);

    const filteredHistory = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return history.filter((item) => {
            const matchSearch = query === "" ||
                item.ingredients.some((ing) => ing.toLowerCase().includes(query)) ||
                item.titre.toLowerCase().includes(query);
            const matchFav = !showOnlyFavorites || item.isFavorite;
            return matchSearch && matchFav;
        });
    }, [history, searchQuery, showOnlyFavorites]);

    const saveHistory = (newHistory: HistoryItem[]) => {
        setHistory(newHistory);
        localStorage.setItem("beau-reste-history", JSON.stringify(newHistory));
    };

    const toggleFavorite = (indexInFiltered: number, e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const updated = history.map(item =>
            item === filteredHistory[indexInFiltered]
                ? { ...item, isFavorite: !item.isFavorite }
                : item
        );
        saveHistory(updated);
    };

    const supprimerUne = (indexInFiltered: number, e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        saveHistory(history.filter(item => item !== filteredHistory[indexInFiltered]));
    };

    const supprimerSelection = () => {
        const toDelete = selectedIndexes.map(i => filteredHistory[i]);
        saveHistory(history.filter(item => !toDelete.includes(item)));
        setSelectedIndexes([]);
        setSelectionMode(false);
    };

    const handleToutSupprimer = () => {
        if (confirmerTout) {
            saveHistory([]);
            setConfirmerTout(false);
            setSelectionMode(false);
            setSelectedIndexes([]);
        } else {
            setConfirmerTout(true);
            setTimeout(() => setConfirmerTout(false), 3000);
        }
    };

    const toggleSelection = (index: number, e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setSelectedIndexes(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    return (
        <div className="history-page">
            <header className="history-hero">
                <div className="history-hero__inner">
                    <div className="history-hero__topline">
                        <Link href="/" className="history-back">
                            ← Retour au frigo
                        </Link>
                        <p className="eyebrow">Archives</p>
                    </div>

                    <div className="history-hero__copy">
                        <h1 className="history-title">Journal des recettes</h1>
                        <p className="history-subtitle">
                            {history.length} création{history.length !== 1 ? "s" : ""} sauvegardée{history.length !== 1 ? "s" : ""} · {history.filter((item) => item.isFavorite).length} favori{history.filter((item) => item.isFavorite).length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </header>

            <main className="history-main">
                {history.length > 0 && (
                    <section className="history-toolbar">
                        <input
                            type="text"
                            placeholder="Rechercher par ingrédient ou titre…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="history-search"
                        />

                        <button
                            type="button"
                            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                            className={`pill-button ${showOnlyFavorites ? "is-active" : ""}`}
                        >
                            {showOnlyFavorites ? "Favoris seulement" : "Voir les favoris"}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setSelectionMode(!selectionMode); setSelectedIndexes([]); }}
                            className={`pill-button ${selectionMode ? "is-inverse" : ""}`}
                        >
                            {selectionMode ? "Annuler la sélection" : "Sélection multiple"}
                        </button>

                        {selectionMode && selectedIndexes.length > 0 && (
                            <button type="button" onClick={supprimerSelection} className="pill-button pill-button--danger">
                                Supprimer {selectedIndexes.length}
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleToutSupprimer}
                            className={`pill-button pill-button--ghost ${confirmerTout ? "is-danger" : ""}`}
                        >
                            {confirmerTout ? "Confirmer la suppression totale" : "Tout supprimer"}
                        </button>
                    </section>
                )}

                {filteredHistory.length === 0 ? (
                    <section className="empty-board">
                        <h2>Aucune recette ne correspond à vos critères.</h2>
                        <p>Essayez un autre mot-clé ou revenez au frigo pour générer une nouvelle idée.</p>
                        <Link href="/" className="secondary-cta">
                            Revenir à l’accueil
                        </Link>
                    </section>
                ) : (
                    <section className="archive-grid">
                        {filteredHistory.map((item, index) => (
                            <article
                                key={index}
                                className={`archive-card ${selectedIndexes.includes(index) ? "is-selected" : ""}`}
                                onClick={() => !selectionMode && setSelectedRecipe(item)}
                            >
                                <div className="archive-card__actions">
                                    {selectionMode ? (
                                        <button
                                            type="button"
                                            onClick={(e) => toggleSelection(index, e)}
                                            className={`selection-box ${selectedIndexes.includes(index) ? "is-checked" : ""}`}
                                        >
                                            {selectedIndexes.includes(index) ? "✓" : ""}
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className="icon-button"
                                                onClick={(e) => supprimerUne(index, e)}
                                                aria-label="Supprimer"
                                            >
                                                ×
                                            </button>
                                            <button
                                                type="button"
                                                className={`icon-button ${item.isFavorite ? "is-favorite" : ""}`}
                                                onClick={(e) => toggleFavorite(index, e)}
                                                aria-label="Favori"
                                            >
                                                ★
                                            </button>
                                        </>
                                    )}
                                </div>

                                <h2 className="archive-card__title">{item.titre}</h2>
                                <p className="archive-card__ingredients">{item.ingredients.join(", ")}</p>
                                <span className="archive-card__cta">Voir la recette</span>
                            </article>
                        ))}
                    </section>
                )}
            </main>

            {selectedRecipe && (
                <div className="modal-backdrop" onClick={() => setSelectedRecipe(null)}>
                    <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedRecipe(null)}>
                            ×
                        </button>
                        <p className="modal-eyebrow">
                            Recette enregistrée {selectedRecipe.isFavorite ? "★" : ""}
                        </p>
                        <h2 className="modal-title">{selectedRecipe.titre}</h2>
                        <p className="modal-meta">
                            <strong>Ingrédients :</strong> {selectedRecipe.ingredients.join(", ")}
                        </p>
                        <div className="modal-content">
                            <RecipeCard text={selectedRecipe.recipe} showTitle={false} />
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}