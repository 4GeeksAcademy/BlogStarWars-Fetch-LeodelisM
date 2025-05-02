import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import apiClient from "../apiClient";
import Loader from "../components/Loader";

export const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar personajes al montar el componente
  useEffect(() => {
    const loadCharacters = async () => {

      try {
        setLoading(true);
        // Llamada a la API (apiClient)
        const response = await apiClient.getCharacters();

        if (response && response.results) {
          setCharacters(response.results);

        } else if (Array.isArray(response)) {
          setCharacters(response);

        } else {
          setError("No se pudieron obtener los datos de personajes");
        }

      } catch (err) {
        console.error("Error al cargar personajes:", err);
        setError("No se pudieron cargar los personajes");
        
      } finally {
        setLoading(false);
      }
    };
    loadCharacters();
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
        {characters.length > 0 ? (
          characters.map((character) => (
            <div
              key={character.uid}
              className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4"
            >
              <Card
                name={character.name}
                uid={character.uid}
                type="characters"
              />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">
              No hay personajes disponibles
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Characters;