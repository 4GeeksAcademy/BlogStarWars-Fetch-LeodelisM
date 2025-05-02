import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import apiClient from "../apiClient";
import Loader from "../components/Loader";

export const Planets = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar planetas al montar el componente
  useEffect(() => {
    const loadPlanets = async () => {

      try {
        setLoading(true);
        // Llamada a la API desde (apiClient)
        const response = await apiClient.getPlanets();
        
        if (response && response.results) {
          setPlanets(response.results);

        } else if (Array.isArray(response)) {
          setPlanets(response);

        } else {
          setError("No se pudieron obtener los datos de planetas");
        }

      } catch (err) {
        console.error("Error al cargar planetas:", err);
        setError("No se pudieron cargar los planetas");

      } finally {
        setLoading(false);
      }
    };
    loadPlanets();
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
      <div className="row g-4">
        {planets.length > 0 ? (
          planets.map((planet) => (
            <div
              key={planet.uid}
              className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4"
            >
              <Card
                name={planet.name}
                uid={planet.uid}
                type="planets"
              />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">
              No hay planetas disponibles
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
