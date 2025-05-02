import React, { useEffect } from 'react';
import { Card } from './Card';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useActions } from "../store.js";

export const CardList = () => {
  const { store, dispatch } = useGlobalReducer();
  const actions = useActions(dispatch);
  
  // Extraemos los datos del store global
  const { characters, vehicles, planets, loading, error } = store;
  
  // Cargar datos al montar el componente
  useEffect(() => {
    actions.loadCharacters();
    actions.loadVehicles();
    actions.loadPlanets();
  }, []);
  
  // Componente para mostrar el carrusel
  const renderCarousel = (type, items) => {
    const isLoading = loading;
    const hasError = error;
    
    // Si está cargando, mostrar indicador
    if (isLoading) {
      return (
        <div className="text-center my-4">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando {type}...</p>
        </div>
      );
    }
    
    // Si hay error, mostrar mensaje y opción para reintentar
    if (hasError) {
      return (
        <div className="my-4 text-center">
          <div className="alert alert-danger" role="alert">{hasError}</div>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              switch(type) {
                case 'characters':
                  actions.loadCharacters();
                  break;
                case 'vehicles':
                  actions.loadVehicles();
                  break;
                case 'planets':
                  actions.loadPlanets();
                  break;
              }
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }
    
    // Función para los nombres en español para los títulos
    const typeNames = {
      characters: "Personajes",
      vehicles: "Vehículos",
      planets: "Planetas"
    };
    
    return (
      <div className="my-4">
        <h2 className="mb-3">{typeNames[type]} de Star Wars</h2>
        {/* Sin datos */}
        {items.length === 0 ? (
          <div className="alert alert-info">
            <span>No hay {typeNames[type].toLowerCase()} disponibles</span>
          </div>
        ) : (
          // Carrusel
          <div className="carousel-container overflow-hidden position-relative">
            <div className="row flex-nowrap overflow-auto pb-3">
              {items.map((item) => (
                <div className="col-12 col-md-6 col-lg-4 px-2" key={item.uid || item.id || Math.random().toString()}>
                  <Card 
                    name={item.name} 
                    uid={item.uid || item.id || "1"} 
                    type={type}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      {/* Carrusel de personajes */}
      {renderCarousel('characters', characters)}
      
      {/* Carrusel de vehículos */}
      {renderCarousel('vehicles', vehicles)}
      
      {/* Carrusel de planetas */}
      {renderCarousel('planets', planets)}
    </div>
  );
};

export default CardList;