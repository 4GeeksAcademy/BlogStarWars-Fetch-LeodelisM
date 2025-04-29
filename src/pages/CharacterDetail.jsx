import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { useActions } from '../store.js';
import Loader from '../components/Loader';

export const CharacterDetail = () => {
  // Obtener el ID del personaje de la URL y el navigate para redireccionar
  const { id } = useParams();

  const navigate = useNavigate();
  
  // Estados locales para manejar carga, error y datos
  const [character, setCharacter] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  
  // Acceder al estado global y dispatch
  const { store, dispatch } = useGlobalReducer();
  
  const actions = useActions(dispatch);

  // Verificar si el personaje está en favoritos
  const isFavorite = store.favorites.some(fav => 
    fav.uid === id && fav.type === "characters"
  );
  
  // Obtener URL de la imagen del personaje
  const imgUrl = actions.getUrlImgCharacter(id);
  
  // Función para obtener datos del personaje
  useEffect(() => {
    const fetchCharacter = async () => {

      try {

        setLoading(true);
        // Llamada a la API
        const response = await fetch(`https://www.swapi.tech/api/people/${id}`);
        
        if (!response.ok) {
          throw new Error('No se pudo obtener la información del personaje');
        }
        
        const data = await response.json();
        setCharacter(data.result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchCharacter();
  }, [id]);
  
  // Función para manejar favoritos
  const handleToggleFavorite = () => {
    if (isFavorite) {
      actions.removeFavorite(id, "characters");
    } else {
      if (character) {
        actions.addFavorite({
          uid: id,
          type: "characters",
          name: character.properties.name,
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
  if (!character) {
    return (
      <div className="alert alert-warning my-3" role="alert">
        No se encontró información para este personaje.
      </div>
    );
  }
  
  // Renderizado normal con datos
  return (
    <div className="card my-4">
      <div className="card-header bg-dark text-white">
        <h2>{character.properties.name}</h2>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 mb-3">
            <img 
              src={imgUrl} 
              alt={character.properties.name}
              className="img-fluid rounded" 
              style={{ maxHeight: "400px", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400?text=No+Image";
              }}
            />
            <div className="mt-3 text-center">
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
          </div>
          <div className="col-md-8">
            <h4 className="mb-3">Información del personaje</h4>
            <table className="table">
              <tbody>
                <tr>
                  <th>Género:</th>
                  <td>{character.properties.gender}</td>
                </tr>
                <tr>
                  <th>Año de nacimiento:</th>
                  <td>{character.properties.birth_year}</td>
                </tr>
                <tr>
                  <th>Altura:</th>
                  <td>{character.properties.height} cm</td>
                </tr>
                <tr>
                  <th>Peso:</th>
                  <td>{character.properties.mass} kg</td>
                </tr>
                <tr>
                  <th>Color de ojos:</th>
                  <td>{character.properties.eye_color}</td>
                </tr>
                <tr>
                  <th>Color de pelo:</th>
                  <td>{character.properties.hair_color}</td>
                </tr>
                <tr>
                  <th>Color de piel:</th>
                  <td>{character.properties.skin_color}</td>
                </tr>
                <tr>
                  <th>Planeta natal:</th>
                  <td>
                    {character.properties.homeworld && (
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Extraer el ID del planeta de la URL
                          const planetId = character.properties.homeworld.split('/').pop();
                          // Navegar al componente del planeta usando useNavigate
                          navigate(`/planets/${planetId}`);
                        }}
                        className="text-primary"
                        style={{textDecoration: "underline", cursor: "pointer"}}
                      >
                        Ver planeta natal
                      </a>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

