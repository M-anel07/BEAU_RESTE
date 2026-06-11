"use client";

type Props = {
    onDemo: () => void;
};

export default function BandeauAccueil({ onDemo }: Props) {
    return (
        <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e7e5e4",
            borderRadius: "16px",
            padding: "1.25rem 1.5rem",
            fontSize: "14px",
            color: "#44403c",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
        }}>
            <p style={{ margin: 0, fontWeight: "600", color: "#711D1B" }}>
                Bienvenue sur Beau Reste
            </p>
            <p style={{ margin: 0, color: "#78716c", lineHeight: "1.5" }}>
                Ajoutez simplement ce qui traîne dans votre frigo, on s'occupe de vous
                trouver une recette anti-gaspillage sur-mesure.
            </p>
            <button
                type="button"
                onClick={onDemo}
                style={{
                    alignSelf: "flex-start",
                    background: "none",
                    border: "none",
                    color: "#711D1B",
                    textDecoration: "underline",
                    fontSize: "13px",
                    fontWeight: "bold",
                    padding: 0,
                    marginTop: "0.25rem",
                    cursor: "pointer",
                }}
            >
                Tester immédiatement avec un exemple (Pâtes, Tomate, Feta) →
            </button>
        </div>
    );
}