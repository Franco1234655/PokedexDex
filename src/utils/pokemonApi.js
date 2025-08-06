const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit = 50, offset = 0) => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return await response.json();
};

export const fetchPokemon = async (nameOrId) => {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  return await response.json();
};

export const fetchPokemonSpecies = async (id) => {
  const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  return await response.json();
};

export const getTypeColor = (type) => {
  const colors = {
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC'
  };
  return colors[type] || '#68A090';
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};