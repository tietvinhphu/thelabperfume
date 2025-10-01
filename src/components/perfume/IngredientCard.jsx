import './IngredientCard.css'

function IngredientCard({ ingredient }) {
  return (
    <div className="ingredient-card">
      <div className="ingredient-card-image">
        {ingredient.image_url ? (
          <img src={ingredient.image_url} alt={ingredient.name} />
        ) : (
          <div className="placeholder-image">🌿</div>
        )}
      </div>
      <div className="ingredient-card-content">
        <h3 className="ingredient-name">{ingredient.name}</h3>
        <span className="ingredient-category">{ingredient.category}</span>
        <p className="ingredient-description">{ingredient.description}</p>
        <div className="ingredient-details">
          {ingredient.origin && (
            <p className="ingredient-origin">
              <strong>Origin:</strong> {ingredient.origin}
            </p>
          )}
          {ingredient.scent_profile && (
            <p className="ingredient-scent">
              <strong>Scent:</strong> {ingredient.scent_profile}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default IngredientCard
