import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { useActions } from '../store'; // Importar directamente useActions

const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  // Obtener las acciones directamente
  const actions = useActions(dispatch);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Calcular el número de favoritos 
  const favoritesCount = store && store.favorites ? store.favorites.length : 0;
  
  // Función para obtener una etiqueta legible del tipo
  const getTypeLabel = (type) => {
    switch (type) {
      case 'characters':
        return 'Personaje';
      case 'planets':
        return 'Planeta';
      case 'vehicles':
        return 'Vehículo';
      default:
        return type;
    }
  };

  // Función para obtener imagen por defecto según el tipo
  const getDefaultImage = (type, uid) => {
    switch (type) {
      case 'characters':
        return `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/characters/${uid}.jpg`;
      case 'vehicles':
        return `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/vehicles/${uid}.jpg`;
      case 'planets':
        return `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/planets/${uid}.jpg`;
      default:
        return "https://placehold.co/40?text=Star+Wars";
    }
  };
  
  // Manejar clic fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Función para eliminar favorito
  const handleRemoveFavorite = (e, uid, type) => {
    e.preventDefault(); // Evitar navegación
    e.stopPropagation(); // Evitar propagación del clic
    
    if (actions && typeof actions.removeFavorite === 'function') {
      actions.removeFavorite(uid, type);
      console.log('Función removeFavorite ejecutada');
    } else {
      console.error('La función removeFavorite no está disponible:', actions);
    }
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <div className="navbar-brand">
          <img 
            src="src/assets/img/LogoBlancoStarWars.png" 
            alt="Star Wars Logo" 
            height="90" 
          />
        </div>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Enlaces convertidos en botones */}
            <li className="nav-item mx-1">
              <Link className="btn btn-outline-warning" to="/">Home</Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="btn btn-outline-primary" to="/characters">Personajes</Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="btn btn-outline-success" to="/planets">Planetas</Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="btn btn-outline-light" to="/vehicles">Vehículos</Link>
            </li>
          </ul>
          
          {/* Dropdown de favoritos */}
          <div className="dropdown" ref={dropdownRef}>
            <button 
              className="btn btn-outline-warning dropdown-toggle position-relative"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              type="button"
            >
              <i className="fas fa-star me-1"></i> Favoritos
              {favoritesCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {favoritesCount}
                  <span className="visually-hidden">favoritos</span>
                </span>
              )}
            </button>
            
            {/* Menú desplegable de favoritos */}
            <div 
              className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`} 
              style={{ minWidth: '280px' }}
            >
              <h6 className="dropdown-header">Mis Favoritos</h6>
              
              {favoritesCount > 0 ? (
                <>
                  {/* Lista de favoritos */}
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {store.favorites.map((favorite) => (
                      <div 
                        key={`${favorite.type}-${favorite.uid}`}
                        className="dropdown-item d-flex align-items-center"
                      >
                        {/* Link para ver detalles (sin evento onClick para evitar conflictos) */}
                        <Link 
                          to={`/${favorite.type}/${favorite.uid}`}
                          className="text-decoration-none text-dark d-flex align-items-center flex-grow-1"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {/* Miniatura */}
                          <div 
                            className="me-2" 
                            style={{ 
                              width: "40px", 
                              height: "40px", 
                              overflow: "hidden",
                              borderRadius: "4px"
                            }}
                          >
                            <img
                              src={favorite.imgUrl || getDefaultImage(favorite.type, favorite.uid)}
                              alt={favorite.name}
                              className="img-fluid"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/40?text=SW";
                              }}
                            />
                          </div>
                          
                          {/* Información */}
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{favorite.name}</div>
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                              {getTypeLabel(favorite.type)}
                            </div>
                          </div>
                        </Link>
                        
                        {/* Botón eliminar (separado para evitar conflictos de eventos) */}
                        <button 
                          className="btn btn-sm btn-outline-danger border-0"
                          onClick={(e) => handleRemoveFavorite(e, favorite.uid, favorite.type)}
                          title="Eliminar de favoritos"
                          style={{ minWidth: "30px" }}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  {/* Enlace a página completa y botón para limpiar */}
                  <div className="d-flex justify-content-between px-2 py-2">
                    <Link 
                      to="/favorites" 
                      className="btn btn-sm btn-primary"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Ver todos
                    </Link>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        if (actions && actions.clearFavorites) {
                          actions.clearFavorites();
                        }
                      }}
                    >
                      Limpiar todos
                    </button>
                  </div>
                </>
              ) : (
                <div className="dropdown-item text-center py-3">
                  <i className="fas fa-heart-broken me-1"></i>
                  No tienes favoritos
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;