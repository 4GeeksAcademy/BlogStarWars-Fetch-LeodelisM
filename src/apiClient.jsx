const BASE_URL = 'https://www.swapi.tech/api';

// Función para obtener la lista de personajes en la page Characters 
export const getCharacters = async () => {
  try {
    const response = await fetch(`${BASE_URL}/people`);
    
    // Convertir la respuesta a JSON
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // Devuelve el objeto completo, no response.data
    
  } catch (error) {
    console.error('Error al obtener personas:', error);
    throw error;
  }
};


// Función para obtener la lista de personajes en Home
export const getCharactersHome = async () => {
  try {
    const response = await fetch(`${BASE_URL}/people`);
    
    // Necesitamos convertir la respuesta a JSON
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // Devuelve el objeto completo, no response.data
    
  } catch (error) {
    console.error('Error al obtener personas:', error);
    throw error;
  }
};


// Función para obtener la lista de vehiculos en Home
export const getVehiclesHome = async () => {
  try {
    const response = await fetch(`${BASE_URL}/vehicles`);
    
    // Necesitamos convertir la respuesta a JSON
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // Devuelve el objeto completo, no response.data
    
  } catch (error) {
    console.error('Error al obtener vehiculos:', error);
    throw error;
  }
};


// Función para obtener la lista de planetas en Home
export const getPlanetsHome = async () => {
  try {
    const response = await fetch(`${BASE_URL}/planets`);
    
    // Necesitamos convertir la respuesta a JSON
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // Devuelve el objeto completo, no response.data
    
  } catch (error) {
    console.error('Error al obtener planetas:', error);
    throw error;
  }
};


export default {
  getCharacters,
  getCharactersHome,
  getVehiclesHome,
  getPlanetsHome,
};