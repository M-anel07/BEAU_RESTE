"use client";

import RecipeCard from "./recipe-card";

type Props = {
    reponse: string;
    loading: boolean;
    copie: boolean;
    onCopy: () => void;
    onRegenerate: () => void;
};

export default function SectionRecette({ reponse, loading, copie, onCopy, onRegenerate }: Props) {
    return (
        <section className="recipe-section">
            <div className="recipe-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="recipe-title">Résultat</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {reponse && !loading && (
                        <button
                            type="button"
                            onClick={onCopy}
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "12px",
                                color: copie ? "#711D1B" : "#78716c",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            {copie ? "✓ Copié !" : "Copier"}
                        </button>
                    )}
                    {reponse && !loading && (
                        <button
                            type="button"
                            onClick={onRegenerate}
                            style={{
                                background: "none",
                                border: "1px solid #d6d3d1",
                                borderRadius: "999px",
                                fontSize: "12px",
                                color: "#78716c",
                                fontWeight: "bold",
                                cursor: "pointer",
                                padding: "4px 12px",
                            }}
                        >
                            Regénérer
                        </button>
                    )}
                    <span className={`recipe-status ${reponse ? "active" : ""}`}>
                        {reponse ? "Prête" : "En attente"}
                    </span>
                </div>
            </div>

            <div className="recipe-body">
                {loading ? (
                    <div className="recipe-loading">
                        <div className="loading-bar"><div className="loading-fill" /></div>
                        <p>L'agent analyse vos ingrédients…</p>
                    </div>
                ) : reponse ? (
                    <div className="home-recipe-container">
                        <RecipeCard text={reponse} />
                    </div>
                ) : (
                    <div className="recipe-placeholder">
                        <p className="placeholder-title">Aucune recette affichée</p>
                        <p className="placeholder-body">
                            Ajoutez les ingrédients disponibles dans votre frigo puis lancez
                            la génération pour obtenir une recette adaptée
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}