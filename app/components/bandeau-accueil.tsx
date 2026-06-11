"use client";

type Props = { onDemo: () => void; };

export default function BandeauAccueil({ onDemo }: Props) {
    return (
        <section className="intro-card">
            <div className="intro-card__copy">
                <p className="intro-card__eyebrow">Première étape</p>
                <p className="intro-card__text">
                    Commencez avec trois ingrédients, puis laissez le générateur proposer une recette simple et exploitable.
                </p>
            </div>

            <div className="intro-card__visual" aria-hidden="true">
                <svg viewBox="0 0 120 120" role="presentation" focusable="false">
                    <circle cx="60" cy="60" r="52" className="intro-card__ring" />
                    <path d="M34 75c8-15 16-23 26-23s18 8 26 23" className="intro-card__wave" />
                    <circle cx="48" cy="46" r="7" className="intro-card__dot" />
                    <circle cx="72" cy="46" r="7" className="intro-card__dot" />
                </svg>
            </div>

            <button type="button" className="intro-card__button" onClick={onDemo}>
                Essayer un exemple
            </button>
        </section>
    );
}