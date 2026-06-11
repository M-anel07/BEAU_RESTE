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
        <section className="result-card">
            <div className="result-card__head">
                <div className="recipe-actions">
                    {reponse && !loading && (
                        <span className={`recipe-action-link ${copie ? "is-active" : ""}`} onClick={onCopy} role="button" tabIndex={0}>
                            {copie ? "Copié" : "Copier"}
                        </span>
                    )}
                    {reponse && !loading && (
                        <span className="recipe-action-link" onClick={onRegenerate} role="button" tabIndex={0}>
                            Régénérer
                        </span>
                    )}
                </div>
            </div>

            <div className="result-card__body">
                {loading ? (
                    <div className="recipe-loading">
                        <div className="loading-bar">
                            <div className="loading-fill" />
                        </div>
                        <p className="loading-text">La recette se construit…</p>
                    </div>
                ) : reponse ? (
                    <RecipeCard text={reponse} />
                ) : (
                    <div className="recipe-placeholder">
                        <p className="placeholder-title">Aucune recette pour le moment</p>
                        <p className="placeholder-body">
                            Ajoutez quelques ingrédients, puis lancez la génération pour obtenir une proposition structurée.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}