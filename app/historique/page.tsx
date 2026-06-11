"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RecipeCard from "../components/recipe-card";

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
        if (selectedRecipe) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [selectedRecipe]);

    const saveHistory = (newHistory: HistoryItem[]) => {
        setHistory(newHistory);
        localStorage.setItem("beau-reste-history", JSON.stringify(newHistory));
    };

    const toggleFavorite = (indexInFiltered: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedHistory = history.map((item) => {
            if (item === filteredHistory[indexInFiltered]) {
                return { ...item, isFavorite: !item.isFavorite };
            }
            return item;
        });
        saveHistory(updatedHistory);
    };

    const supprimerUne = (indexInFiltered: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const itemToDelete = filteredHistory[indexInFiltered];
        saveHistory(history.filter(item => item !== itemToDelete));
    };

    const supprimerSelection = () => {
        const itemsToDelete = selectedIndexes.map(i => filteredHistory[i]);
        saveHistory(history.filter(item => !itemsToDelete.includes(item)));
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

    const toggleSelection = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndexes(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = searchQuery.trim() === "" ||
            item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
            item.titre.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFavorite = !showOnlyFavorites || item.isFavorite;
        return matchesSearch && matchesFavorite;
    });

    return (
        <div className="app-shell" style={{ padding: "2rem 1.5rem", minHeight: "100vh", backgroundColor: "#FAF6F0" }}>

            <style jsx global>{`
                .large-popup-content p,
                .large-popup-content li,
                .large-popup-content span,
                .large-popup-content div { font-size: 14px !important; line-height: 1.6 !important; }
                .large-popup-content h3,
                .large-popup-content h4 { font-size: 18px !important; font-weight: bold !important; color: #711D1B !important; }
                @media (max-width: 640px) {
                    .filter-row { flex-direction: column !important; align-items: stretch !important; }
                    .search-input { max-width: 100% !important; }
                    .responsive-popup { padding: 2rem 1.5rem !important; width: 95% !important; height: 90vh !important; }
                    .responsive-popup h2 { font-size: 20px !important; padding-right: 2rem; }
                }
            `}</style>

            <header style={{ marginBottom: "2rem" }}>
                <Link href="/" style={{ color: "#711D1B", fontWeight: "bold", textDecoration: "none", fontSize: "14px" }}>
                    ← Retour au frigo
                </Link>
                <h1 className="sidebar-title" style={{ marginTop: "1rem", fontSize: "28px" }}>Mon Journal de Recettes</h1>
                <p style={{ color: "#78716c", fontSize: "14px" }}>
                    Retrouvez ici l'intégralité de vos créations anti-gaspillage ({history.length})
                </p>
            </header>

            {history.length > 0 && (
                <>
                    <div className="filter-row" style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                        <input
                            type="text"
                            placeholder="Filtrer par ingrédient ou titre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                            style={{
                                padding: "10px 16px", borderRadius: "12px", border: "1px solid #e7e5e4",
                                backgroundColor: "#ffffff", fontSize: "14px", color: "#44403c",
                                outline: "none", width: "100%", maxWidth: "350px"
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                            style={{
                                padding: "10px 16px", borderRadius: "12px", border: "1px solid #e7e5e4",
                                backgroundColor: showOnlyFavorites ? "#711D1B" : "#ffffff",
                                color: showOnlyFavorites ? "#ffffff" : "#44403c",
                                fontSize: "14px", fontWeight: "500", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.2s"
                            }}
                        >
                            <span>{showOnlyFavorites ? "★" : "☆"}</span>
                            Voir uniquement les favoris
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
                        <button
                            type="button"
                            onClick={() => { setSelectionMode(!selectionMode); setSelectedIndexes([]); }}
                            style={{
                                padding: "8px 14px", borderRadius: "999px", border: "1px solid #e7e5e4",
                                backgroundColor: selectionMode ? "#44403c" : "#ffffff",
                                color: selectionMode ? "#ffffff" : "#78716c",
                                fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s"
                            }}
                        >
                            {selectionMode ? "Annuler la sélection" : "Sélectionner"}
                        </button>

                        {selectionMode && selectedIndexes.length > 0 && (
                            <button
                                type="button"
                                onClick={supprimerSelection}
                                style={{
                                    padding: "8px 14px", borderRadius: "999px",
                                    border: "1px solid #711D1B", backgroundColor: "#711D1B",
                                    color: "#ffffff", fontSize: "12px", fontWeight: "600",
                                    cursor: "pointer", transition: "all 0.2s"
                                }}
                            >
                                Supprimer ({selectedIndexes.length})
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleToutSupprimer}
                            style={{
                                padding: "8px 14px", borderRadius: "999px",
                                border: confirmerTout ? "1px solid #711D1B" : "1px solid #e7e5e4",
                                backgroundColor: "transparent",
                                color: confirmerTout ? "#711D1B" : "#a8a29e",
                                fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s"
                            }}
                        >
                            {confirmerTout ? "⚠ Confirmer la suppression totale" : "Tout supprimer"}
                        </button>
                    </div>
                </>
            )}

            {filteredHistory.length === 0 ? (
                <p style={{ color: "#78716c" }}>Aucune recette ne correspond à vos critères.</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    {filteredHistory.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => !selectionMode && setSelectedRecipe(item)}
                            style={{
                                border: selectedIndexes.includes(index) ? "2px solid #711D1B" : "1px solid #e7e5e4",
                                borderRadius: "16px", padding: "1.5rem",
                                backgroundColor: selectedIndexes.includes(index) ? "#fff8f8" : "#ffffff",
                                cursor: "pointer", position: "relative",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            {/* Actions en haut à droite */}
                            <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                {selectionMode ? (
                                    <button
                                        type="button"
                                        onClick={(e) => toggleSelection(index, e)}
                                        style={{
                                            width: "20px", height: "20px", borderRadius: "4px",
                                            border: selectedIndexes.includes(index) ? "2px solid #711D1B" : "2px solid #d6d3d1",
                                            backgroundColor: selectedIndexes.includes(index) ? "#711D1B" : "transparent",
                                            cursor: "pointer", display: "flex", alignItems: "center",
                                            justifyContent: "center", color: "#ffffff",
                                            fontSize: "12px", fontWeight: "bold", padding: 0
                                        }}
                                    >
                                        {selectedIndexes.includes(index) ? "✓" : ""}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => supprimerUne(index, e)}
                                            style={{
                                                background: "none", border: "none", fontSize: "18px",
                                                color: "#d6d3d1", cursor: "pointer", padding: 0,
                                                lineHeight: 1, transition: "color 0.2s"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = "#711D1B"}
                                            onMouseLeave={(e) => e.currentTarget.style.color = "#d6d3d1"}
                                            aria-label="Supprimer cette recette"
                                        >
                                            ×
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => toggleFavorite(index, e)}
                                            style={{
                                                background: "none", border: "none", fontSize: "20px",
                                                cursor: "pointer", color: item.isFavorite ? "#D4AF37" : "#d6d3d1",
                                                outline: "none", padding: 0
                                            }}
                                        >
                                            {item.isFavorite ? "★" : "☆"}
                                        </button>
                                    </>
                                )}
                            </div>

                            <h3 style={{ color: "#711D1B", fontWeight: "bold", marginBottom: "0.5rem", fontSize: "16px", paddingRight: "3rem" }}>
                                {item.titre}
                            </h3>
                            <p style={{ fontSize: "12px", color: "#78716c", margin: 0 }}>
                                <strong>Ingrédients :</strong> {item.ingredients.join(", ")}
                            </p>
                            <div style={{ marginTop: "1rem", fontSize: "12px", color: "#711D1B", fontWeight: "bold" }}>
                                Voir la recette complète →
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedRecipe && (
                <div
                    style={{
                        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)",
                        display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999,
                    }}
                    onClick={() => setSelectedRecipe(null)}
                >
                    <div
                        className="responsive-popup"
                        style={{
                            backgroundColor: "#FAF6F0", width: "90%", maxWidth: "1050px",
                            maxHeight: "85vh", borderRadius: "24px", padding: "3rem 4rem",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                            display: "flex", flexDirection: "column", position: "relative"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedRecipe(null)}
                            style={{
                                position: "absolute", top: "1.25rem", right: "1.5rem",
                                background: "none", border: "none", fontSize: "30px",
                                cursor: "pointer", color: "#78716c", outline: "none", zIndex: 10
                            }}
                        >×</button>

                        <span style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "#78716c", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                            Recette enregistrée {selectedRecipe.isFavorite ? "★" : ""}
                        </span>
                        <h2 style={{ color: "#711D1B", fontSize: "24px", fontWeight: "bold", marginBottom: "0.5rem" }}>
                            {selectedRecipe.titre}
                        </h2>
                        <p style={{ fontSize: "14px", color: "#78716c", marginBottom: "1.5rem", borderBottom: "1px solid #e7e5e4", paddingBottom: "1rem" }}>
                            <strong>Ingrédients utilisés :</strong> {selectedRecipe.ingredients.join(", ")}
                        </p>
                        <div className="large-popup-content" style={{ overflowY: "auto", paddingRight: "0.5rem", color: "#292524" }}>
                            <RecipeCard text={selectedRecipe.recipe} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}