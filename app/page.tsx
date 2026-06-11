"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRefrigerateur } from "./hooks/use-refrigerateur";
import { useHistorique } from "./hooks/use-historique";
import { useGenerationRecette } from "./hooks/use-generation-recette";
import PanneauRefrigo from "./components/panneau-refrigo";
import SectionRecette from "./components/section-recette";
import ColonneHistorique from "./components/colonne-historique";
import Footer from "./components/footer";

export default function Home() {
    const frigo = useRefrigerateur();
    const { history, addToHistory, supprimerHistorique } = useHistorique();
    const recette = useGenerationRecette();

    const stats = useMemo(() => [
        { value: `${frigo.frigo.length}`, label: "Ingrédients saisis" },
        { value: `${history.length}`, label: "Recettes sauvegardées" },
        { value: "0", label: "Gaspillage évité" },
    ], [frigo.frigo.length, history.length]);

    const handleGenerer = async () => {
        const resultat = await recette.generate(frigo.getAllIngredients());
        if (resultat) {
            addToHistory({
                ingredients: frigo.getAllIngredients(),
                recipe: resultat.text,
                titre: resultat.titre,
            });
        }
    };

    return (
        <div className="page-shell">
            <header className="hero-shell">
                <div className="hero-shell__inner">
                    <div className="hero-copy">
                        <p className="eyebrow">Cuisine anti-gaspi</p>
                        <h1 className="hero-title">Transformez votre frigo en bonne idée.</h1>
                        <p className="hero-text">
                            Beau Reste compose des recettes lisibles, rapides et utiles à partir de ce qui traîne déjà chez vous.
                        </p>
                        <div className="hero-actions">
                            <button type="button" className="primary-cta" onClick={frigo.loadDemo}>
                                Charger un exemple
                            </button>
                            <Link href="/historique" className="secondary-cta">
                                Voir l’historique
                            </Link>
                        </div>
                    </div>

                    <div className="hero-visual" aria-hidden="true">
                        <img src="/frigo-hero.svg" alt="" />
                    </div>

                    <div className="hero-stats">
                        {stats.map((stat) => (
                            <article key={stat.label} className="stat-card">
                                <strong>{stat.value}</strong>
                                <span>{stat.label}</span>
                            </article>
                        ))}
                    </div>
                </div>
            </header>

            <main className="page-content">
                {/* 1. La grille ne contient plus que le Frigo et l'Historique côte à côte */}
                <div className="page-grid">
                    <PanneauRefrigo
                        fridge={frigo}
                        onGenerate={handleGenerer}
                        loading={recette.loading}
                    />
                    <ColonneHistorique
                        history={history}
                        onSelect={(item) => {
                            recette.setReponse(item.recipe);
                            frigo.setFrigo(item.ingredients);
                        }}
                        onDelete={supprimerHistorique}
                    />
                </div>

                <div style={{ marginTop: "1.25rem", width: "100%" }}>
                    <SectionRecette
                        reponse={recette.reponse}
                        loading={recette.loading}
                        copie={recette.copie}
                        onCopy={recette.copierRecette}
                        onRegenerate={handleGenerer}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}