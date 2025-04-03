import "./InfoCard.scss";

export default function InfoCard({
  monument,
  handleCardClick,
  handleDeleteMarker,
}) {
  return (
    <div
      className="info-card"
      onClick={(e) => {
        e.stopPropagation();
        handleCardClick(monument);
      }}
    >
      <h3 className="info-card__name">{monument.name}</h3>
      <p className="info-card__description">{monument.description}</p>
      <p className="info-card__location">{monument.location}</p>
      <button
        className="info-card__button"
        onClick={() => handleDeleteMarker(monument)}
      >
        ❌
      </button>
    </div>
  );
}
