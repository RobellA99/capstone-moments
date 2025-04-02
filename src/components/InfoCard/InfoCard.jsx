import "./InfoCard.scss";

export default function InfoCard({ monument }) {
  return (
    <div className="info-card">
      <h3 className="info-card__title">{monument.name}</h3>
      <p className="info-card__description">{monument.description}</p>
      <p className="info-card__address">{monument.address}</p>
    </div>
  );
}
