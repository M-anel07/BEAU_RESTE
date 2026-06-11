"use client";

import Link from "next/link";
import type { ElementHistorique } from "../hooks/use-historique";

type Props = {
    history: ElementHistorique[];
    onSelect: (item: ElementHistorique) => void;
    onDelete: (i: number) => void;
};

export default function ColonneHistorique({ history, onSelect, onDelete }: Props) {
    return (
        <aside className="sidebar" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="sidebar-header" style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                <h2 className="sidebar-title" style={{ margin: 0 }}>Recettes passées</h2>
                <p className="section-label" style={{ margin: 0, fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "#78716c", letterSpacing: "0.05em" }}>
                    • Journal
                </p>
            </div>

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
                                onClick={() => onSelect(item)}
                            >
                                <p className="history-count">{item.titre}</p>
                                <p className="history-ingredients">{item.ingredients.join(", ")}</p>
                            </button>
                            <button
                                type="button"
                                className="history-delete"
                                onClick={() => onDelete(index)}
                                aria-label={`Supprimer la recette ${index + 1}`}
                            >
                                ×
                            </button>
                        </article>
                    ))
                )}
            </div>

            {history.length > 4 && (
                <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "0.5rem" }}>
                    <Link href="/historique" style={{ color: "#711D1B", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                        Voir tout l'historique ({history.length}) →
                    </Link>
                </div>
            )}
        </aside>
    );
}