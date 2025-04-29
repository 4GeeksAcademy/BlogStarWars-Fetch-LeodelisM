import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import apiClient from "../apiClient";

export const Planets = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar personajes al montar el componente
  useEffect(() => {

    const loadPlanets= async () => {

      try {

        setLoading(true);
        // Llamada a la API (apiClient)
        const response = await apiClient.getPlanets();

        if (response && response.results) {
          setPlanets(response.results);

        } else if (Array.isArray(response)) {
          setPlanets(response);

        } else {
          setError("No se pudieron obtener los planetas");
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

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando planetas...</p>
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
          These are the main <strong>Planets</strong> from Star Wars:
        </h2>
      </div>
      <div className="row mx-3 mt-3">
        {planets.length > 0 ? (
          planets.map((planets) => (
            <div
              key={planets.uid}
              className="col-12 col-md-6 col-lg-4 col-xl-3 my-3"
            >
              <Card
                name={planets.name}
                uid={planets.uid}
                type="planets"
                img={`https://starwars-visualguide.com/assets/img/planets/${planets.uid}.jpg`}
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
    </>
  );
};
