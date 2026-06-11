"use client";

import type { useRefrigerateur } from "../hooks/use-refrigerateur";

type Props = {
    fridge: ReturnType<typeof useRefrigerateur>;
    onGenerate: () => void;
    loading: boolean;
};

export default function PanneauRefrigo({ fridge, onGenerate, loading }: Props) {
    const { currentIngredient, setCurrentIngredient, frigo, placard, setPlacard,
        ajouterIngredient, supprimerIngredient, viderFrigo } = fridge;

    return (
        <div className="input-panel">
            <form onSubmit={ajouterIngredient} className="input-row">
                <input
                    type="text"
                    placeholder="Ajouter un ingrédient ex : tomate, feta, basilic…"
                    className="ingredient-input"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                />
                <button type="submit" className="btn btn-add">
                    Ajouter
                </button>
            </form>

            {/* Chips ingrédients */}
            <div className="ingredients-area">
                {frigo.length === 0 ? (
                    <p className="ingredients-placeholder">
                        Votre frigo est vide, commencez par ajouter des ingrédients
                    </p>
                ) : (
                    <div className="chips-grid">
                        <p className="chips-label">Dans votre frigo</p>
                        <div className="chips-row">
                            {frigo.map((item, index) => (
                                <span key={item + index} className="chip">
                                    {item}
                                    <button
                                        type="button"
                                        className="chip-remove"
                                        onClick={() => supprimerIngredient(index)}
                                        aria-label={`Retirer ${item}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="action-row" style={{ marginTop: "1.5rem" }}>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onGenerate}
                    disabled={loading || frigo.length === 0}
                >
                    {loading ? (
                        <span className="btn-loading">
                            <span className="dot" /><span className="dot" /><span className="dot" />
                        </span>
                    ) : (
                        "Générer une recette"
                    )}
                </button>
                <button type="button" className="btn btn-ghost" onClick={viderFrigo}>
                    Tout vider
                </button>
            </div>
        </div>
    );
}