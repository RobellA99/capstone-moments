import "./ProfilePage.scss";

export default function ProfilePage() {
  const savedRoutes = [
    { id: 1, name: "Historic Landmarks", tags: ["History", "Culture"] },
    { id: 2, name: "Modern Attractions", tags: ["Architecture", "City"] },
  ];

  return (
    <div className="profile">
      <div className="profile__header">
        <div className="profile__avatar-container">
          <img
            src="https://api.dicebear.com/9.x/identicon/svg"
            alt="User Avatar"
            className="profile__avatar"
          />
          <button className="profile__avatar-button">Change Avatar</button>
        </div>
        <div className="profile__details">
          <h2 className="profile__name">John Doe</h2>
          <p className="profile__email">johndoe@example.com</p>
          <p className="profile__dob">Date of Birth: January 1, 1990</p>
          <div className="profile__stats">
            <div className="profile__stat">
              <h3>Followers</h3>
              <p>120</p>
            </div>
            <div className="profile__stat">
              <h3>Following</h3>
              <p>80</p>
            </div>
          </div>
        </div>
      </div>
      <div className="profile__routes">
        <h2 className="profile__routes-header">Saved Routes</h2>
        {savedRoutes.length > 0 ? (
          <ul className="profile__routes-list">
            {savedRoutes.map((route) => (
              <li key={route.id} className="profile__route">
                <h3 className="profile__route-name">{route.name}</h3>
                <p className="profile__route-tags">
                  Tags: {route.tags.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="profile__routes-empty">No saved routes yet.</p>
        )}
      </div>
    </div>
  );
}
