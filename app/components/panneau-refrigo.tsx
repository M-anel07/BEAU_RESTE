"use client";

import type { useRefrigerateur } from "../hooks/use-refrigerateur";

type Props = {
    fridge: ReturnType<typeof useRefrigerateur>;
    onGenerate: () => void;
    loading: boolean;
};

export default function PanneauRefrigo({ fridge, onGenerate, loading }: Props) {
    const { currentIngredient, setCurrentIngredient, frigo,
        ajouterIngredient, supprimerIngredient, viderFrigo } = fridge;

    return (
        <section className="panel-card">
            <div className="panel-card__head">
                <p className="panel-card__eyebrow">Votre frigo</p>
                <h2 className="panel-card__title">Ajoutez ce que vous avez sous la main.</h2>
                <p className="panel-card__text">
                    Séparez les ingrédients avec une virgule pour accélérer la saisie.
                </p>
            </div>

            <form onSubmit={ajouterIngredient} className="panel-form">
                <input
                    type="text"
                    placeholder="Tomate, feta, restes de poulet…"
                    className="panel-input"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                />
                <button type="submit" className="panel-add" aria-label="Ajouter l'ingrédient">
                    Ajouter
                </button>
            </form>

            <div className="ingredients-area">
                {frigo.length === 0 ? (
                    <div className="empty-fridge">
                        <span>Le frigo est vide pour le moment.</span>
                        <p>Ajoutez quelques produits ou lancez l’exemple pour démarrer.</p>
                    </div>
                ) : (
                    <>
                        <p className="chips-label">{frigo.length} ingrédient{frigo.length > 1 ? "s" : ""} détecté{frigo.length > 1 ? "s" : ""}</p>
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
                    </>
                )}
            </div>

            <div className="panel-actions">
                <button
                    type="button"
                    className="panel-primary"
                    onClick={onGenerate}
                    disabled={loading || frigo.length === 0}
                >
                    {loading ? "Génération…" : "Générer une recette"}
                </button>
                {frigo.length > 0 && (
                    <button type="button" className="panel-secondary" onClick={viderFrigo}>
                        Tout vider
                    </button>
                )}
            </div>
        </section>
    );
}