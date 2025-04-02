import { NavLink } from "react-router-dom";
import "./SideBar.scss";

export default function SideBar() {
  return (
    <section className="bar">
      <h2></h2>

      <div className="bar__container">
        <NavLink to="/" className="bar__link">
          Map
        </NavLink>
        <NavLink to="/profile" className="bar__link">
          Profile
        </NavLink>
      </div>
    </section>
  );
}
// Sidebar.js
// import React from "react";
// import "./Sidebar.scss";

// export default function Sidebar({ markers }) {
//   return (
//     <div className="sidebar">
//       <h2>Selected Landmarks</h2>
//       {markers.length > 0 ? (
//         <ul>
//           {markers.map((marker) => (
//             <li key={marker.id}>
//               <h3>{marker.name}</h3>
//               <p>{marker.description}</p>
//               <p>
//                 <strong>Address:</strong> {marker.address}
//               </p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No landmarks selected.</p>
//       )}
//     </div>
//   );
// }
