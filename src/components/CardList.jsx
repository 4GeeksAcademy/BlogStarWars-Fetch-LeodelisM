import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import apiClient from '../apiClient';

export const CardList = () => {
  const { store, actions } = useGlobalReducer();
  const [loading, setLoading] = useState({
    characters: false,
    vehicles: false,
    planets: false
  });
  const [error, setError] = useState({
    characters: null,
    vehicles: null,
    planets: null
  });
  
  // Estado para cada tipo de datos
  const [characters, setCharacters] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [planets, setPlanets] = useState([]);
  
  // Función genérica para cargar datos
  const loadData = async (type) => {
    // Actualizamos el estado de carga solo para este tipo
    setLoading(prev => ({ ...prev, [type]: true }));
    setError(prev => ({ ...prev, [type]: null }));
    
    let apiMethod;
    let setterFunction;
    
    // Configuramos la función API y el setter según el tipo
    switch(type) {
      case 'characters':
        apiMethod = apiClient.getCharactersHome;
        setterFunction = setCharacters;
        break;
      case 'vehicles':
        apiMethod = apiClient.getVehiclesHome;
        setterFunction = setVehicles;
        break;
      case 'planets':
        apiMethod = apiClient.getPlanetsHome;
        setterFunction = setPlanets;
        break;
      default:
        return;
    }
    
    try {
      // Asumimos que llamamos a la página 1 sin paginación
      const response = await apiMethod(1);
      
      if (response && response.results) {
        setterFunction(response.results);
      } else {
        // Intentar detectar resultados en diferentes formatos
        const data = detectResults(response);
        if (data) {
          setterFunction(data);
        } else {
          setError(prev => ({ ...prev, [type]: `No se pudieron cargar los ${type}` }));
        }
      }
    } catch (error) {
      console.error(`Error al cargar ${type}:`, error);
      setError(prev => ({ ...prev, [type]: `Error al conectar con la API para ${type}` }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };
  
  // Función auxiliar para detectar resultados en diferentes estructuras
  const detectResults = (data) => {
    if (!data) return null;
    
    if (data.results && Array.isArray(data.results)) return data.results;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (Array.isArray(data)) return data;
    
    return null;
  };
  
  // Cargar datos al montar el componente
  useEffect(() => {
    loadData('characters');
    loadData('vehicles');
    loadData('planets');
  }, []);
  
  // Componente para mostrar el carrusel
  const renderCarousel = (type, items) => {
    const isLoading = loading[type];
    const hasError = error[type];
    
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
          <button className="btn btn-primary" onClick={() => loadData(type)}>
            Intentar de nuevo
          </button>
        </div>
      );
    }
    
    // Nombre en español para los títulos
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