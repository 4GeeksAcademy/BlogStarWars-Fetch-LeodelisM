import React, { useState } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import Card from '../components/Card';
import { useActions } from '../store';

export const Favorites = () => {
  const { store, dispatch } = useGlobalReducer();
  const actions = useActions(dispatch);
 
  // Estado para el filtro seleccionado
  const [filter, setFilter] = useState('all');
 
  // Verificar si hay favoritos
  const hasFavorites = store.favorites && store.favorites.length > 0;
 
  // Filtrar favoritos según la selección
  const filteredFavorites = hasFavorites
    ? filter === 'all'
      ? store.favorites
      : store.favorites.filter(item => item.type === filter)
    : [];
 
  // Manejar el cambio de filtro
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
 
  return (
    <div className="container my-5">
      <h1 className="mb-4">Mis Favoritos</h1>
      
      {hasFavorites ? (
        <>
          {/* Barra de filtro completa */}
          <div className="bg-light p-3 mb-4 rounded">
            <div className="row g-2 align-items-center">
              <div className="col-md-4">
                <label htmlFor="typeFilter" className="col-form-label">Filtrar por tipo:</label>
              </div>
              <div className="col-md-8">
                <select
                  id="typeFilter"
                  className="form-select"
                  value={filter}
                  onChange={handleFilterChange}
                >
                  <option value="all">Todos</option>
                  <option value="characters">Personajes</option>
                  <option value="planets">Planetas</option>
                  <option value="vehicles">Vehículos</option>
                </select>
              </div>
            </div>
          </div>
         
          {/* Lista de favoritos */}
          {filteredFavorites.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {filteredFavorites.map((favorite) => (
                <div className="col" key={`${favorite.type}-${favorite.uid}`}>
                  <Card
                    name={favorite.name || 'Sin nombre'}
                    uid={favorite.uid}
                    type={favorite.type}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No hay favoritos que coincidan con el filtro seleccionado.
            </div>
          )}
        </>
      ) : (
        <div className="alert alert-warning">
          <i className="fas fa-heart-broken me-2"></i>
          No tienes favoritos guardados. ¡Explora la galaxia y añade algunos!
        </div>
      )}
    </div>
  );
};