import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { useActions } from '../store.js';
import Loader from '../components/Loader';

export const PlanetDetail = () => {
  // Obtener el ID del planeta de la URL
  const { id } = useParams();
 
  // Estados locales para manejar carga, error y datos
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Acceder al estado global y dispatch
  const { store, dispatch } = useGlobalReducer();
  const actions = useActions(dispatch);

  // Verificar si el planeta está en favoritos
  const isFavorite = store.favorites.some(fav => 
    fav.uid === id && fav.type === "planets"
  );
  
  // Obtener URL de la imagen del planeta con operador ternario para planeta ID 1, porque no tiene imagen
  const imgUrl = id === "1" 
    ? "https://static.wikia.nocookie.net/esstarwars/images/b/b0/Tatooine_TPM.png" 
    : actions.getUrlImgPlanets(id);
  
  // Función para obtener datos del planeta
  useEffect(() => {
    const fetchPlanet = async () => {
      try {
        setLoading(true);
        // Llamada a la API, la llame directamente no desde apiClient
        const response = await fetch(`https://www.swapi.tech/api/planets/${id}`);
        
        if (!response.ok) {
          throw new Error('No se pudo obtener la información del planeta');
        }
        
        const data = await response.json();
        setPlanet(data.result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchPlanet();
  }, [id]);
  
  // Función para manejar favoritos
  const handleToggleFavorite = () => {
    if (isFavorite) {
      actions.removeFavorite(id, "planets");
    } else {
      if (planet) {
        actions.addFavorite({
          uid: id,
          type: "planets",
          name: planet.properties.name,
          imgUrl: imgUrl
        });
      }
    }
  };
  
  // Renderizado condicional según el estado
  
  // Si está cargando
  if (loading) {
    return <Loader />;
  }
  
  // Si hay un error
  if (error) {
    return (
      <div className="alert alert-danger my-3" role="alert">
        {error}
      </div>
    );
  }
  
  // Si no hay datos
  if (!planet) {
    return (
      <div className="alert alert-warning my-3" role="alert">
        No se encontró información para este planeta.
      </div>
    );
  }
  
  return (
    <div className="container-fluid px-4 mt-5" style={{ maxWidth: "1350px", margin: "0 auto" }}>
      <div className="card border" style={{ borderRadius: "16px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center" 
             style={{ borderRadius: "16px 16px 0 0", border: "2px solid #FFC107" }}>
          <h2 className="mb-0">{planet.properties.name}</h2>
          <button
            type="button"
            className="btn"
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
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <img 
                src={imgUrl} 
                alt={planet.properties.name}
                className="img-fluid rounded" 
                style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/400?text=${encodeURIComponent(planet.properties.name)}`;
                }}
              />
            </div>
            <div className="col-md-8">
              <h4 className="mb-3">Información del planeta</h4>
              <table className="table">
                <tbody>
                  <tr>
                    <th>Diámetro:</th>
                    <td>{planet.properties.diameter} km</td>
                  </tr>
                  <tr>
                    <th>Periodo de rotación:</th>
                    <td>{planet.properties.rotation_period} horas</td>
                  </tr>
                  <tr>
                    <th>Periodo orbital:</th>
                    <td>{planet.properties.orbital_period} días</td>
                  </tr>
                  <tr>
                    <th>Gravedad:</th>
                    <td>{planet.properties.gravity}</td>
                  </tr>
                  <tr>
                    <th>Población:</th>
                    <td>{planet.properties.population}</td>
                  </tr>
                  <tr>
                    <th>Clima:</th>
                    <td>{planet.properties.climate}</td>
                  </tr>
                  <tr>
                    <th>Terreno:</th>
                    <td>{planet.properties.terrain}</td>
                  </tr>
                  <tr>
                    <th>Agua superficial:</th>
                    <td>{planet.properties.surface_water}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};