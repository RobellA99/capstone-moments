import "./InfoCard.scss";

export default function InfoCard({
  monument,
  handleCardClick,
  handleDeleteMarker,
  setStartingMarker,
  startingMarker,
}) {
  const isStartingMarker = startingMarker === monument.id;

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
      <div className="info-card__buttons">
        <button
          className={`info-card__button-start ${
            isStartingMarker ? "info-card__button-start--selected" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setStartingMarker(isStartingMarker ? null : monument.id);
          }}
        >
          {isStartingMarker ? "Deselect Start" : "Set as Start"}
        </button>
        <button
          className="info-card__button-delete"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteMarker(monument);
          }}
        >
          ❌
        </button>
      </div>
    </div>
  );
}
