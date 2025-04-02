import "./InfoCard.scss";

export default function InfoCard({ monument }) {
  return (
    <div className="info-card">
      <h3 className="info-card__name">{monument.name}</h3>
      <p className="info-card__description">{monument.description}</p>
      <p className="info-card__location">{monument.location}</p>
    </div>
  );
}
