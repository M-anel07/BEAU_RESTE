type Props = {
    text: string;
    showTitle?: boolean;
};

export default function RecipeCard({ text, showTitle = true }: Props) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    const etapesRaw = lines
        .filter(l => /^\d+[\.]/.test(l))
        .map(l => l.replace(/^\d+[\.]\s*/, ""));

    const titre = lines.find(l => /^titre\s*:/i.test(l))
        ?.replace(/^titre\s*:\s*/i, "") ?? "";

    const tempsLine = lines.find(l => /^temps\s*:/i.test(l));
    let temps = tempsLine?.replace(/^temps\s*:\s*/i, "") ?? "";
    if (temps && !/min/i.test(temps)) temps = `${temps} min`;

    const ingredientLines = lines
        .filter(l => l.startsWith("-"))
        .map(l => l.replace(/^-\s*/, ""));

    const etapes = etapesRaw.filter(l =>
        l !== titre
        && !/^(préparation|ingrédients|étapes|liste|temps|conseil)/i.test(l)
        && !/^\d+\s*minutes?/i.test(l)
    );

    return (
        <article className="recipe-document">
            <header className="recipe-document__head">
                <div className="recipe-document__title-row">
                    {showTitle && <h3 className="recipe-document__title">{titre || "Recette sans titre"}</h3>}
                    {temps && <p className="recipe-document__time">{temps}</p>}
                </div>
            </header>

            {ingredientLines.length > 0 && (
                <>
                    <p className="recipe-card-section">Ingrédients</p>
                    <div className="recipe-chips">
                        {ingredientLines.map((ing, i) => (
                            <span key={i} className="recipe-chip">{ing}</span>
                        ))}
                    </div>
                </>
            )}
            {etapes.length > 0 && (
                <>
                    <p className="recipe-card-section">Étapes</p>
                    <ol className="recipe-steps">
                        {etapes.map((etape, i) => (
                            <li key={i} className="recipe-step">
                                <span className="recipe-step-num">{i + 1}</span>
                                <span>{etape}</span>
                            </li>
                        ))}
                    </ol>
                </>
            )}
        </article>
    );
}