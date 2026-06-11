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
        <aside className="history-panel">
            <div className="history-panel__head">
                <p className="history-panel__eyebrow">Journal</p>
                <h2 className="history-panel__title">Dernières recettes</h2>
                <p className="history-panel__text">
                    Revenez sur une proposition précédente ou supprimez les essais qui ne vous servent plus.
                </p>
            </div>

            <div className="history-list">
                {history.length === 0 ? (
                    <div className="history-empty">
                        Aucune recette pour l’instant. Lancez votre première génération pour remplir ce carnet.
                    </div>
                ) : (
                    history.slice(0, 1).map((item, index) => (
                        <article key={index} className="history-card">
                            <button type="button" className="history-card__body" onClick={() => onSelect(item)}>
                                <p className="history-card__title">{item.titre}</p>
                                <p className="history-card__meta">{item.ingredients.join(", ")}</p>
                            </button>
                            <button
                                type="button"
                                className="history-delete"
                                onClick={() => onDelete(index)}
                                aria-label="Supprimer"
                            >
                                ×
                            </button>
                        </article>
                    ))
                )}
            </div>

            {history.length > 4 && (
                <div className="history-panel__footer">
                    <Link href="/historique" className="history-panel__link">
                        Voir toutes les recettes ({history.length})
                    </Link>
                </div>
            )}
        </aside>
    );
}