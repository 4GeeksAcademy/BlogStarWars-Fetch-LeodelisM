export const initialStore = () => {
  // Cargar favoritos guardados en localStorage
  // en localStorage los datos persisten
  const savedFavorites = localStorage.getItem('favorites');
  //Esta función convierte una cadena de texto con formato JSON en un objeto JavaScript
  //Los datos en localStorage siempre se guardan como strings, pero favoritos es uj array de objetos
  const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  
  return {
    characters: [], // Lista de personajes
    vehicles: [], // Lista de vehículos
    planets: [], // Lista de planetas
    favorites: parsedFavorites, // Carga los favoritos desde localStorage, cuando existen
    loading: false,
    error: null
  };
};

export default function storeReducer(store, action = {}) {
  console.log("Reducer procesando acción:", action.type, action.payload);
  
  switch (action.type) {

    case 'set_characters':
      return {
        ...store,
        characters: action.payload,
        loading: false
      };
    
    case 'set_vehicles':
      return {
        ...store,
        vehicles: action.payload,
        loading: false
      };
    
    case 'set_planets':
      return {
        ...store,
        planets: action.payload,
        loading: false
      };

    case 'set_loading':
      return {
        ...store,
        loading: action.payload
      };

    case 'set_error':
      return {
        ...store,
        error: action.payload,
        loading: false
      };

    case 'add_favorite':
      // Evitar duplicados en favoritos
      const existingFav = store.favorites.find(fav => 
        fav.uid === action.payload.uid && fav.type === action.payload.type
      );
      
      if (existingFav) {
        return store; // No añadir si ya existe
      }
      
      // Crea nueva lista de favoritos
      const updatedFavorites = [...store.favorites, action.payload];
      
      // Guardar en localStorage
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      return {
        ...store,
        favorites: updatedFavorites
      };

    case 'remove_favorite':
      
      // Convertir uids a string para comparación segura
      const filteredFavorites = store.favorites.filter(
        fav => !(String(fav.uid) === String(action.payload.uid) && fav.type === action.payload.type)
      );
      
      console.log("Favoritos después:", filteredFavorites);
      
      // Guardar en localStorage
      localStorage.setItem('favorites', JSON.stringify(filteredFavorites));
      
      return {
        ...store,
        favorites: filteredFavorites
      };
    
    case 'clear_favorites':
      // Eliminar todos los favoritos
      localStorage.removeItem('favorites');
      
      return {
        ...store,
        favorites: []
      };
      
    default:
      throw Error('Acción desconocida: ' + action.type);
  }
}

// Acciones para usar con el store
export const useActions = (dispatch) => {
  // Función para cargar datos
  const cargarDatos = async (url, tipo) => {

    dispatch({ type: 'set_loading', payload: true });
    try {

      const respuesta = await fetch(url);
      
      const datos = await respuesta.json();
      
      dispatch({ type: tipo, payload: datos.results || [] });
    
    } catch (error) {
      console.error(`Error al cargar datos: ${error}`);

      dispatch({ type: 'set_error', payload: `Error al cargar datos: ${error.message}` });
    }
  };

  // Retornar el objeto con todas las acciones
  return {
    // Acciones de carga de datos
    loadCharacters: () => cargarDatos('https://www.swapi.tech/api/people', 'set_characters'),
    loadVehicles: () => cargarDatos('https://www.swapi.tech/api/vehicles', 'set_vehicles'),
    loadPlanets: () => cargarDatos('https://www.swapi.tech/api/planets', 'set_planets'),
    
    // Acción para añadir favoritos
    addFavorite: (item) => {
      console.log("Añadiendo favorito:", item);
      dispatch({ 
        type: 'add_favorite', 
        payload: item 
      });
    },
    
    // Acción para eliminar favoritos 
    removeFavorite: (uid, type) => {
      console.log("Acción removeFavorite llamada con:", { uid, type });
      dispatch({ 
        type: 'remove_favorite', 
        payload: { uid, type } 
      });
    },
    
    // Limpiar todos los favoritos
    clearFavorites: () => {
      dispatch({ type: 'clear_favorites' });
    },
    
    // Funciones para obtener URLs de imágenes
    getUrlImgCharacter: (uid) => {
      return `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/characters/${uid}.jpg`;
    },
    
    getUrlImgVehicle: (uid) => {
      return `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/vehicles/${uid}.jpg`;
    },

    getUrlImgPlanets: (uid) => {
      return `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/planets/${uid}.jpg`;
    }
  };
};
