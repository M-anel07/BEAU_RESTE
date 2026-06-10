"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RecipeCard from "../components/recipe-card";

type HistoryItem = {
    ingredients: string[];
    recipe: string;
    titre: string;
};

export default function HistoriquePage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // États pour gérer le pop-up de la recette sélectionnée
    const [selectedRecipe, setSelectedRecipe] = useState<HistoryItem | null>(null);

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

    return (
        <div className="app-shell" style={{ padding: "2rem", minHeight: "100vh", backgroundColor: "#FAF6F0" }}>
            
            {/* Forçage CSS ajusté à 14px pour le contenu du pop-up */}
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

            {history.length === 0 ? (
                <p>Aucune recette dans l'historique pour le moment.</p>
            ) : (
                /* Grille des cartes cliquables */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    {history.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedRecipe(item)}
                            style={{
                                border: "1px solid #e7e5e4",
                                borderRadius: "16px",
                                padding: "1.5rem",
                                backgroundColor: "#ffffff",
                                cursor: "pointer",
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
                            <h3 style={{ color: "#711D1B", fontWeight: "bold", marginBottom: "0.5rem", fontSize: "16px" }}>{item.titre}</h3>
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
                            maxWidth: "1050px", // 👈 Largeur maximale augmentée
                            maxHeight: "80vh",
                            borderRadius: "24px",
                            padding: "3rem 4rem", // Plus d'air sur les côtés internes
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
                            Recette enregistrée
                        </span>
                        <h2 style={{ color: "#711D1B", fontSize: "24px", fontWeight: "bold", marginBottom: "0.5rem" }}>
                            {selectedRecipe.titre}
                        </h2>
                        
                        <p style={{ fontSize: "14px", color: "#78716c", marginBottom: "1.5rem", borderBottom: "1px solid #e7e5e4", paddingBottom: "1rem" }}>
                            <strong>Ingrédients utilisés :</strong> {selectedRecipe.ingredients.join(", ")}
                        </p>

                        {/* Zone de texte de la recette */}
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