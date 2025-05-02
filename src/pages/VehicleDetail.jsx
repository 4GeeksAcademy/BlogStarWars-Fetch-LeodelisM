import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { useActions } from '../store.js';
import Loader from '../components/Loader';

export const VehicleDetail = () => {
  // Obtener el ID del vehículo de la URL
  const { id } = useParams();
 
  // Estados locales para manejar carga, error y datos
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Acceder al estado global y dispatch
  const { store, dispatch } = useGlobalReducer();
  const actions = useActions(dispatch);

  // URL de la imagen
  const imgUrl = actions.getUrlImgVehicle(id)

  // Verificar si el vehículo está en favoritos
  const isFavorite = store.favorites.some(fav => 
    fav.uid === id && fav.type === "vehicles"
  );
  
  // Función para obtener datos del vehículo
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        // Llamada a la API
        const response = await fetch(`https://www.swapi.tech/api/vehicles/${id}`);
        
        if (!response.ok) {
          throw new Error('No se pudo obtener la información del vehículo');
        }
        
        const data = await response.json();
        setVehicle(data.result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchVehicle();
  }, [id]);
  
  // Función para manejar favoritos
  const handleToggleFavorite = () => {
    if (isFavorite) {
      actions.removeFavorite(id, "vehicles");
    } else {
      if (vehicle) {
        actions.addFavorite({
          uid: id,
          type: "vehicles",
          name: vehicle.properties.name,
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
  if (!vehicle) {
    return (
      <div className="alert alert-warning my-3" role="alert">
        No se encontró información para este vehículo/nave.
      </div>
    );
  }
  
  return (
    <div className="container-fluid px-4 mt-5" style={{ maxWidth: "1350px", margin: "0 auto" }}>
      <div className="card border" style={{ borderRadius: "16px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center" 
             style={{ borderRadius: "16px 16px 0 0", border: "2px solid #FFC107" }}>
          <h2 className="mb-0">{vehicle.properties.name}</h2>
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
                alt={vehicle.properties.name}
                className="img-fluid rounded" 
                style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/400?text=${encodeURIComponent(vehicle.properties.name)}`;
                }}
              />
            </div>
            <div className="col-md-8">
              <h4 className="mb-3">Información del vehículo</h4>
              <table className="table">
                <tbody>
                  <tr>
                    <th>Modelo:</th>
                    <td>{vehicle.properties.model}</td>
                  </tr>
                  <tr>
                    <th>Fabricante:</th>
                    <td>{vehicle.properties.manufacturer}</td>
                  </tr>
                  <tr>
                    <th>Clase:</th>
                    <td>{vehicle.properties.vehicle_class}</td>
                  </tr>
                  <tr>
                    <th>Costo en créditos:</th>
                    <td>{vehicle.properties.cost_in_credits}</td>
                  </tr>
                  <tr>
                    <th>Longitud:</th>
                    <td>{vehicle.properties.length} m</td>
                  </tr>
                  <tr>
                    <th>Velocidad máxima:</th>
                    <td>{vehicle.properties.max_atmosphering_speed} km/h</td>
                  </tr>
                  <tr>
                    <th>Tripulación:</th>
                    <td>{vehicle.properties.crew}</td>
                  </tr>
                  <tr>
                    <th>Pasajeros:</th>
                    <td>{vehicle.properties.passengers}</td>
                  </tr>
                  <tr>
                    <th>Capacidad de carga:</th>
                    <td>{vehicle.properties.cargo_capacity} kg</td>
                  </tr>
                  <tr>
                    <th>Consumibles:</th>
                    <td>{vehicle.properties.consumables}</td>
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

