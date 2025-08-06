import React from 'react';
import { getTypeColor, capitalizeFirstLetter } from '../utils/pokemonApi';

const PokemonCard = ({ pokemon, onClick }) => {
  const mainType = pokemon.types[0].type.name;
  const typeColor = getTypeColor(mainType);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700"
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${typeColor}15, transparent 50%)`
      }}
    >
      <div className="relative">
        <div className="absolute top-2 right-2 text-xs font-bold text-gray-400 dark:text-gray-500">
          #{pokemon.id.toString().padStart(3, '0')}
        </div>
        <div className="flex justify-center pt-6 pb-4">
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-24 h-24 object-contain hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>
      
      <div className="p-4 pt-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 text-center">
          {capitalizeFirstLetter(pokemon.name)}
        </h3>
        
        <div className="flex flex-wrap justify-center gap-1">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className="px-3 py-1 text-xs font-medium text-white rounded-full"
              style={{ backgroundColor: getTypeColor(type.type.name) }}
            >
              {capitalizeFirstLetter(type.type.name)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;