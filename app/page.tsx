"use client";

import { useState, useEffect, type FormEvent } from "react";
import RecipeCard from "./components/recipe-card";
import Link from "next/link";
import Footer from "./components/footer";

type HistoryItem = {
  ingredients: string[];
  recipe: string;
  titre: string;
};

export default function Home() {
  const [copie, setCopie] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [frigo, setFrigo] = useState<string[]>([]);
  const [reponse, setReponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("beau-reste-history");
      if (saved) setHistory(JSON.parse(saved));
    } catch { }
  }, []);

  const [placard, setPlacard] = useState({
    ailOignon: false,
    cremeBeurre: false,
    bouillon: false,
    sauces: false,
  });

  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("beau-reste-history", JSON.stringify(newHistory));
  };

  const ajouterIngredient = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const parts = currentIngredient.split(",").map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return;
    setFrigo((cur) => [...new Set([...cur, ...parts])]);
    setCurrentIngredient("");
  };

  const cuisiner = async () => {
    if (frigo.length === 0) return;
    setLoading(true);
    setReponse("");

    const listeBasiques = [];
    if (placard.ailOignon) listeBasiques.push("ail", "oignon");
    if (placard.cremeBeurre) listeBasiques.push("crème fraîche", "beurre");
    if (placard.bouillon) listeBasiques.push("bouillon cube");
    if (placard.sauces) listeBasiques.push("moutarde", "ketchup");

    const tousLesIngredients = [...new Set([...frigo, ...listeBasiques])];

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: tousLesIngredients }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      const text = typeof data.text === "string" ? data.text : "Réponse indisponible.";
      const titreMatch = text.match(/^titre\s*:\s*(.+)/im);
      const titre = titreMatch ? titreMatch[1].trim() : "Recette";
      setReponse(text);
      updateHistory([{ ingredients: tousLesIngredients, recipe: text, titre }, ...history]);
    } catch {
      setReponse("Erreur technique.");
    } finally {
      setLoading(false);
    }
  };

  const supprimerIngredient = (i: number) =>
    setFrigo((cur) => cur.filter((_, idx) => idx !== i));

  const viderFrigo = () => {
    setFrigo([]);
    setReponse("");
    setPlacard({
      ailOignon: false,
      cremeBeurre: false,
      bouillon: false,
      sauces: false,
    });
  };

  const supprimerHistorique = (i: number) =>
    updateHistory(history.filter((_, idx) => idx !== i));

  const copierRecette = async () => {
    if (!reponse) return;
    try {
      await navigator.clipboard.writeText(reponse);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch (err) {
      console.error("Erreur de copie :", err);
    }
  };

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-name">BEAU RESTE</span>
          </div>
          <p className="header-tagline">
            Des recettes à partir de ce que vous avez
          </p>
        </div>
        <div className="header-rule" />
      </header>

      <div className="app-body">
        {/* ── Sidebar historique ── */}
        <aside className="sidebar" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Header sur la même ligne */}
          <div className="sidebar-header" style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
            <h2 className="sidebar-title" style={{ margin: 0 }}>Recettes passées</h2>
            <p className="section-label" style={{ margin: 0, fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "#78716c", letterSpacing: "0.05em" }}>
              • Journal
            </p>
          </div>

          {/* Zone des cartes : On affiche STRICTEMENT les 3 dernières. */}
          <div className="history-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {history.length === 0 ? (
              <div className="history-empty">
                <p>Aucune recette pour l'instant, lancez votre première génération</p>
              </div>
            ) : (
              history.slice(0, 4).map((item, index) => (
                <article key={index} className="history-card">
                  <button
                    type="button"
                    className="history-card-body"
                    onClick={() => {
                      setReponse(item.recipe);
                      setFrigo(item.ingredients);
                    }}
                  >
                    <p className="history-count">{item.titre}</p>
                    <p className="history-ingredients">
                      {item.ingredients.join(", ")}
                    </p>
                  </button>
                  <button
                    type="button"
                    className="history-delete"
                    onClick={() => supprimerHistorique(index)}
                    aria-label={`Supprimer la recette ${index + 1}`}
                  >
                    ×
                  </button>
                </article>
              ))
            )}
          </div>

          {/* Lien vers la page historique si plus de 3 recettes */}
          {history.length > 4 && (
            <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "0.5rem" }}>
              <Link
                href="/historique"
                style={{
                  color: "#711D1B",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Voir tout l'historique ({history.length}) →
              </Link>
            </div>
          )}
        </aside>

        {/* ── Zone principale ── */}
        <main className="main-area" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>

          {/* Input bar */}
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

            {/* Fond de placard */}
            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e7e5e4" }}>
              <p style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "#78716c", marginBottom: "0.75rem" }}>
                Fond de placard disponible :
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem", fontSize: "14px", color: "#44403c" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={placard.ailOignon} onChange={(e) => setPlacard({ ...placard, ailOignon: e.target.checked })} style={{ accentColor: "#711D1B" }} />
                  Ail / Oignon
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={placard.cremeBeurre} onChange={(e) => setPlacard({ ...placard, cremeBeurre: e.target.checked })} style={{ accentColor: "#711D1B" }} />
                  Crème / Beurre
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={placard.bouillon} onChange={(e) => setPlacard({ ...placard, bouillon: e.target.checked })} style={{ accentColor: "#711D1B" }} />
                  Bouillon cube
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={placard.sauces} onChange={(e) => setPlacard({ ...placard, sauces: e.target.checked })} style={{ accentColor: "#711D1B" }} />
                  Moutarde / Ketchup
                </label>
              </div>
            </div>

            <div className="action-row" style={{ marginTop: "1.5rem" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={cuisiner}
                disabled={loading || frigo.length === 0}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </span>
                ) : (
                  "Générer une recette"
                )}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={viderFrigo}
              >
                Tout vider
              </button>
            </div>
          </div>

          {/* Recette */}
          <section className="recipe-section">
            <div className="recipe-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="recipe-title">Résultat</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {reponse && !loading && (
                  <button
                    type="button"
                    onClick={copierRecette}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "12px",
                      color: copie ? "#711D1B" : "#78716c",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                  >
                    {copie ? "✓ Copié !" : "Copier"}
                  </button>
                )}
                {reponse && !loading && (
                  <button
                    type="button"
                    onClick={cuisiner}
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
                  <div className="loading-bar">
                    <div className="loading-fill" />
                  </div>
                  <p>L'agent analyse vos ingrédients…</p>
                </div>
              ) : reponse ? (
                /* Conteneur avec la taille de police idéale et modérée */
                <div className="home-recipe-container">
                  <style jsx global>{`
                    .home-recipe-container p, 
                    .home-recipe-container li,
                    .home-recipe-container span,
                    .home-recipe-container div {
                        font-size: 14px !important;
                        line-height: 1.6 !important;
                    }
                    .home-recipe-container h3,
                    .home-recipe-container h4 {
                        font-size: 18px !important;
                        font-weight: bold !important;
                        color: #711D1B !important;
                    }
                  `}</style>
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

          {/* Ton composant Footer externalisé et réutilisable */}
          <Footer />
        </main>
      </div>
    </div>
  );
}