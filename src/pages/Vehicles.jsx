import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import apiClient from "../apiClient";
import Loader from "../components/Loader";

export const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar vehículos/naves al montar el componente
  useEffect(() => {
    const loadVehicles = async () => {
      try {

        setLoading(true);
        // Llamada a la API (apiClient)
        const response = await apiClient.getVehicles();
        if (response && response.results) {
          setVehicles(response.results);

        } else if (Array.isArray(response)) {
          setVehicles(response);

        } else {
          setError("No se pudieron obtener los datos de vehículos/naves");
        }

      } catch (err) {
        console.error("Error al cargar vehículos/naves:", err);

        setError("No se pudieron cargar los vehículos/nave");
      
      } finally {

        setLoading(false);
      }
    };
    loadVehicles();
  }, []);
  
  // Usar el componente Loader durante la carga
  if (loading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <div className="container-fluid px-4" style={{ maxWidth: "1350px", margin: "0 auto" }}>
        <div className="alert alert-warning my-5">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-fluid px-4 mt-4" style={{ maxWidth: "1350px", margin: "0 auto" }}>
      {/* Contenedor de cards */}
      <div className="row g-4">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <div
              key={vehicle.uid}
              className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4"
            >
              <Card
                name={vehicle.name}
                uid={vehicle.uid}
                type="vehicles"
              />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">
              No hay vehículos/naves disponibles
            </div>
          </div>
        )}
      </div>
    </div>
  );
};