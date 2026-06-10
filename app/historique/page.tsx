"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RecipeCard from "../components/recipe-card";

type HistoryItem = {
    ingredients: string[];
    recipe: string;
    titre: string;
    isFavorite?: boolean; // Optionnel pour rétrocompatibilité
};

export default function HistoriquePage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<HistoryItem | null>(null);
    
    // Nouveaux états pour la recherche et les favoris
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    // 1. Charger l'historique depuis le localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("beau-reste-history");
            if (saved) setHistory(JSON.parse(saved));
        } catch { }
    }, []);

    // 2. Bloquer le scroll de l'arrière-plan quand le pop-up est ouvert
    useEffect(() => {
        if (selectedRecipe) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedRecipe]);

    // Gérer l'action de mettre en favori
    const toggleFavorite = (indexInFiltered: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Évite d'ouvrir le pop-up au clic sur l'étoile
        
        // On retrouve l'item réel dans le vrai tableau history
        const updatedHistory = history.map((item, idx) => {
            if (item === filteredHistory[indexInFiltered]) {
                return { ...item, isFavorite: !item.isFavorite };
            }
            return item;
        });

        setHistory(updatedHistory);
        localStorage.setItem("beau-reste-history", JSON.stringify(updatedHistory));
    };

    // 3. Filtrer l'historique selon la recherche ET le filtre favoris
    const filteredHistory = history.filter(item => {
        const matchesSearch = searchQuery.trim() === "" || 
            item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
            item.titre.toLowerCase().includes(searchQuery.toLowerCase());
            
        const matchesFavorite = !showOnlyFavorites || item.isFavorite;

        return matchesSearch && matchesFavorite;
    });

    return (
        <div className="app-shell" style={{ padding: "2rem", minHeight: "100vh", backgroundColor: "#FAF6F0" }}>
            
            <style jsx global>{`
                .large-popup-content p, 
                .large-popup-content li, 
                .large-popup-content span,
                .large-popup-content div {
                    font-size: 14px !important;
                    line-height: 1.6 !important;
                }
                .large-popup-content h3,
                .large-popup-content h4 {
                    font-size: 18px !important;
                    font-weight: bold !important;
                    color: #711D1B !important;
                }
            `}</style>

            <header style={{ marginBottom: "2rem" }}>
                <Link href="/" style={{ color: "#711D1B", fontWeight: "bold", textDecoration: "none", fontSize: "14px" }}>
                    ← Retour au frigo
                </Link>
                <h1 className="sidebar-title" style={{ marginTop: "1rem", fontSize: "28px" }}>Mon Journal de Recettes</h1>
                <p style={{ color: "#78716c", fontSize: "14px" }}>Retrouvez ici l'intégralité de vos créations anti-gaspillage ({history.length})</p>
            </header>

            {/* ── BARRE DE FILTRES & RECHERCHE ── */}
            {history.length > 0 && (
                <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center" }}>
                    <input 
                        type="text"
                        placeholder="Filtrer par ingrédient ou titre... ex: Tomate"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: "10px 16px",
                            borderRadius: "12px",
                            border: "1px solid #e7e5e4",
                            backgroundColor: "#ffffff",
                            fontSize: "14px",
                            color: "#44403c",
                            outline: "none",
                            width: "100%",
                            maxWidth: "350px"
                        }}
                    />
                    
                    <button
                        type="button"
                        onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                        style={{
                            padding: "10px 16px",
                            borderRadius: "12px",
                            border: "1px solid #e7e5e4",
                            backgroundColor: showOnlyFavorites ? "#711D1B" : "#ffffff",
                            color: showOnlyFavorites ? "#ffffff" : "#44403c",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            transition: "all 0.2s"
                        }}
                    >
                        <span>{showOnlyFavorites ? "★" : "☆"}</span>
                        Voir uniquement les favoris
                    </button>
                </div>
            )}

            {filteredHistory.length === 0 ? (
                <p style={{ color: "#78716c" }}>Aucune recette ne correspond à vos critères.</p>
            ) : (
                /* Grille des cartes cliquables */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    {filteredHistory.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedRecipe(item)}
                            style={{
                                border: "1px solid #e7e5e4",
                                borderRadius: "16px",
                                padding: "1.5rem",
                                backgroundColor: "#ffffff",
                                cursor: "pointer",
                                position: "relative",
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
                            {/* BOUTON ÉTOILE FAVORIS */}
                            <button
                                type="button"
                                onClick={(e) => toggleFavorite(index, e)}
                                style={{
                                    position: "absolute",
                                    top: "1.25rem",
                                    right: "1.25rem",
                                    background: "none",
                                    border: "none",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: item.isFavorite ? "#D4AF37" : "#d6d3d1", // Doré si favori, gris sinon
                                    outline: "none",
                                    padding: 0
                                }}
                            >
                                {item.isFavorite ? "★" : "☆"}
                            </button>

                            <h3 style={{ color: "#711D1B", fontWeight: "bold", marginBottom: "0.5rem", fontSize: "16px", paddingRight: "1.5rem" }}>
                                {item.titre}
                            </h3>
                            
                            <p style={{ fontSize: "12px", color: "#78716c", margin: 0 }}>
                                <strong>Ingrédients :</strong> {item.ingredients.join(", ")}
                            </p>

                            <div style={{ marginTop: "1rem", fontSize: "12px", color: "#711D1B", fontWeight: "bold", textDecoration: "none" }}>
                                Voir la recette complète →
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── POP-UP MODAL ÉLARGI ── */}
            {selectedRecipe && (
                <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                    onClick={() => setSelectedRecipe(null)}
                >
                    <div 
                        style={{
                            backgroundColor: "#FAF6F0",
                            width: "95%",
                            maxWidth: "1050px",
                            maxHeight: "80vh",
                            borderRadius: "24px",
                            padding: "3rem 4rem",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Bouton Fermer */}
                        <button
                            onClick={() => setSelectedRecipe(null)}
                            style={{
                                position: "absolute",
                                top: "1.5rem",
                                right: "2rem",
                                background: "none",
                                border: "none",
                                fontSize: "30px", 
                                cursor: "pointer",
                                color: "#78716c",
                                outline: "none"
                            }}
                        >
                            ×
                        </button>

                        <span style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "#78716c", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                            Recette enregistrée {selectedRecipe.isFavorite ? "★" : ""}
                        </span>
                        <h2 style={{ color: "#711D1B", fontSize: "24px", fontWeight: "bold", marginBottom: "0.5rem" }}>
                            {selectedRecipe.titre}
                        </h2>
                        
                        <p style={{ fontSize: "14px", color: "#78716c", marginBottom: "1.5rem", borderBottom: "1px solid #e7e5e4", paddingBottom: "1rem" }}>
                            <strong>Ingrédients utilisés :</strong> {selectedRecipe.ingredients.join(", ")}
                        </p>

                        <div 
                            className="large-popup-content"
                            style={{ 
                                overflowY: "auto", 
                                paddingRight: "0.5rem",
                                color: "#292524"
                            }}
                        >
                            <RecipeCard text={selectedRecipe.recipe} />
                        </div>
                    </div>
                </div>
            )}           
        </div>
    );
}