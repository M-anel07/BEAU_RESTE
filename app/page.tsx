"use client";

import { useRefrigerateur } from "./hooks/use-refrigerateur";
import { useHistorique } from "./hooks/use-historique";
import { useGenerationRecette } from "./hooks/use-generation-recette";
import BandeauAccueil from "./components/bandeau-accueil";
import PanneauRefrigo from "./components/panneau-refrigo";
import SectionRecette from "./components/section-recette";
import ColonneHistorique from "./components/colonne-historique";
import Footer from "./components/footer";

export default function Home() {
  const frigo = useRefrigerateur();
  const { history, addToHistory, supprimerHistorique } = useHistorique();
  const recette = useGenerationRecette();

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
    <div className="app-shell" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <style jsx global>{`
        .app-body {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          align-items: flex-start;
          width: 100%;
          flex-grow: 1;
        }
        .sidebar { width: 300px; flex-shrink: 0; }
        .main-area { flex-grow: 1; display: flex; flex-direction: column; gap: 1.5rem; width: 100%; }
        @media (max-width: 768px) {
          .app-shell { padding: 1rem !important; }
          .app-body { flex-direction: column-reverse !important; gap: 2.5rem !important; }
          .sidebar { width: 100% !important; }
          .input-row { display: flex !important; flex-direction: column !important; gap: 0.75rem !important; }
          .ingredient-input, .btn-add { width: 100% !important; }
        }
        .home-recipe-container p:not(.recipe-card-name) { font-size: 14px !important; line-height: 1.6 !important; }
        .home-recipe-container li { font-size: 14px !important; line-height: 1.6 !important; }
        .home-recipe-container span { font-size: 14px !important; line-height: 1.6 !important; }
        .home-recipe-container div { font-size: 14px !important; line-height: 1.6 !important; }
        .home-recipe-container h3,
        .home-recipe-container h4 { font-size: 18px !important; font-weight: bold !important; color: #711D1B !important; }
      `}</style>

      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-name">BEAU RESTE</span>
          </div>
          <p className="header-tagline">Des recettes à partir de ce que vous avez</p>
        </div>
        <div className="header-rule" />
      </header>

      <div className="app-body">
        <ColonneHistorique
          history={history}
          onSelect={(item) => {
            recette.setReponse(item.recipe);
            frigo.setFrigo(item.ingredients);
          }}
          onDelete={supprimerHistorique}
        />

        <main className="main-area">
          {frigo.frigo.length === 0 && (
            <BandeauAccueil onDemo={frigo.loadDemo} />
          )}
          <PanneauRefrigo
            fridge={frigo}
            onGenerate={handleGenerer}
            loading={recette.loading}
          />
          <SectionRecette
            reponse={recette.reponse}
            loading={recette.loading}
            copie={recette.copie}
            onCopy={recette.copierRecette}
            onRegenerate={handleGenerer}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}