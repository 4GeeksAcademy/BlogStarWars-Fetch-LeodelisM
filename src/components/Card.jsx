import React from 'react';
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useActions } from "../store.js";

export const Card = ({ name, uid, type }) => {
  const { store, dispatch } = useGlobalReducer();
  const actions = useActions(dispatch);
  const navigate = useNavigate();
  
  // Funciones para obtener URLs de imágenes directamente en el componente
  const getUrlImgCharacter = (characterId) => {
    return `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/characters/${characterId}.jpg`;
  };
  
  const getUrlImgVehicles = (vehiclesId) => {
    return `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/vehicles/${vehiclesId}.jpg`;
  };
  
  const getUrlImgPlanets = (id) => {
    if (id === "1") {
      return "https://upload.wikimedia.org/wikipedia/en/6/6d/Tatooine_%28fictional_desert_planet%29.jpg";
    } else {
      return `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/planets/${id}.jpg`;
    }
  };
  
  
  // Determinar URL de imagen según el tipo (en este caso personajes, vehiculos, planetas)
  let imgSrc;
  switch (type) {
    case "characters":
      imgSrc = getUrlImgCharacter(uid);
      break;
    case "vehicles":
      imgSrc = getUrlImgVehicles(uid);
      break;
    case "planets":
      imgSrc = getUrlImgPlanets(uid);
      break;
    default:
      imgSrc = "https://placehold.co/400x200"; 
  }
  
  //Sección de Favoritos
  // Verificar si está en favoritos
  const isFavorite = store.favorites.some(fav => 
    fav.uid === uid && fav.type === type
  );
  
  // Función para añadir a favoritos
  const handleToggleFavorite = () => {
    if (isFavorite) {
      actions.removeFavorite(uid, type);
    } else {
      actions.addFavorite({
        uid, 
        type, 
        name,
        imgUrl: imgSrc
      });
    }
  };
  
  return (
    <div className="card h-100 border-secondary-subtle ms-1 me-1">
      <img
        className="card-img-top img-fluid"
        src={imgSrc}
        alt={`${name} image`}
        onClick={() => navigate(`/${type}/${uid}`)}
        style={{ cursor: "pointer", objectFit: "cover", height: "auto", width: "100%" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/400?text=No+Image";
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>
        <div className="mt-auto d-flex align-items-center">
          <button
            type="button"
            className="btn btn-outline-primary flex-grow-1"
            onClick={() => navigate(`/${type}/${uid}`)}
          >
            Ver detalles
          </button>
          
          {/* Botón de estrella */}
          <button
            type="button"
            className="btn ms-2"
            onClick={handleToggleFavorite}
            title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            style={{ 
              backgroundColor: isFavorite ? "#FFC107" : "transparent",
              borderColor: "#FFC107",
              width: "46px",
              height: "38px"
            }}
          >
            <i 
              className={`fas fa-star ${isFavorite ? 'text-dark' : 'text-warning'}`}
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;