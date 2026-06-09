type Props = { text: string };

export default function RecipeCard({ text }: Props) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    const etapesRaw = lines
        .filter(l => /^\d+[\.]/.test(l))
        .map(l => l.replace(/^\d+[\.]\s*/, ""));

    const titre = lines.find(l => /^titre\s*:/i.test(l))
        ?.replace(/^titre\s*:\s*/i, "") ?? "";

    const tempsLine = lines.find(l => /^temps\s*:/i.test(l));
    const temps = tempsLine?.replace(/^temps\s*:\s*/i, "") ?? "";

    const ingredientLines = lines
        .filter(l => l.startsWith("-"))
        .map(l => l.replace(/^-\s*/, ""));

    const etapes = etapesRaw.filter(l =>
        l !== titre
        && !/^(préparation|ingrédients|étapes|liste|temps|conseil)/i.test(l)
        && !/^\d+\s*minutes?/i.test(l)
    );

    return (
        <div className="recipe-card">
            <p className="recipe-card-name">{titre}</p>
            {temps && <p className="recipe-card-time">{temps}</p>}
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
        </div>
    );
}