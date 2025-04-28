import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import apiClient from "../apiClient";

export const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar personajes al montar el componente
  useEffect(() => {

    const loadCharacters = async () => {

      try {

        setLoading(true);
        // Usar directamente apiClient en lugar de actions
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

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando personajes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-4">
        <h2 className="star-wars-title">
          These are the main <strong>characters</strong> from Star Wars:
        </h2>
      </div>
      <div className="row mx-3 mt-3">
        {characters.length > 0 ? (
          characters.map((character) => (
            <div
              key={character.uid}
              className="col-12 col-md-6 col-lg-4 col-xl-3 my-3"
            >
              <Card
                name={character.name}
                uid={character.uid}
                type="characters"
                img={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/characters/${character.uid}.jpg`}
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
    </>
  );
};

export default Characters;