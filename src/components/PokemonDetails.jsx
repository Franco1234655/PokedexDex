import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, Zap, Activity } from 'lucide-react';
import { fetchPokemon, fetchPokemonSpecies, getTypeColor, capitalizeFirstLetter } from '../utils/pokemonApi';

const PokemonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPokemon = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const pokemonData = await fetchPokemon(id);
        const speciesData = await fetchPokemonSpecies(pokemonData.id);
        setPokemon(pokemonData);
        setSpecies(speciesData);
      } catch (error) {
        console.error('Erreur lors du chargement du Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Pokémon non trouvé</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const mainType = pokemon.types[0].type.name;
  const typeColor = getTypeColor(mainType);
  const description = species?.flavor_text_entries
    .find(entry => entry.language.name === 'fr')?.flavor_text
    .replace(/\f/g, ' ') || 'Aucune description disponible.';

  const getStatIcon = (statName) => {
    switch (statName) {
      case 'hp': return <Heart className="w-5 h-5" />;
      case 'attack': return <Zap className="w-5 h-5" />;
      case 'defense': return <Shield className="w-5 h-5" />;
      case 'speed': return <Activity className="w-5 h-5" />;
      default: return <div className="w-5 h-5 bg-current rounded"></div>;
    }
  };

  const getStatLabel = (statName) => {
    const labels = {
      'hp': 'PV',
      'attack': 'Attaque',
      'defense': 'Défense',
      'special-attack': 'Att. Spé.',
      'special-defense': 'Déf. Spé.',
      'speed': 'Vitesse'
    };
    return labels[statName] || statName;
  };

  return (
    <div 
      className="min-h-screen pt-20"
      style={{
        background: `linear-gradient(135deg, ${typeColor}20, transparent 70%)`
      }}
    >
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au Pokédex
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div 
            className="text-white p-8 text-center relative"
            style={{ backgroundColor: typeColor }}
          >
            <div className="absolute top-4 right-4 text-white/70 font-bold text-lg">
              #{pokemon.id.toString().padStart(3, '0')}
            </div>
            <img
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-48 h-48 mx-auto mb-4 filter drop-shadow-lg"
            />
            <h1 className="text-4xl font-bold mb-2">{capitalizeFirstLetter(pokemon.name)}</h1>
            <div className="flex justify-center gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium"
                >
                  {capitalizeFirstLetter(type.type.name)}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Description</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
            </div>

            {/* Info physique */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Informations physiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Taille:</span>
                    <span className="font-medium text-gray-800 dark:text-white">{pokemon.height / 10} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Poids:</span>
                    <span className="font-medium text-gray-800 dark:text-white">{pokemon.weight / 10} kg</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Capacités</h3>
                <div className="space-y-2">
                  {pokemon.abilities.map((ability, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                      <span className="text-gray-800 dark:text-white font-medium">
                        {capitalizeFirstLetter(ability.ability.name.replace('-', ' '))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Statistiques</h3>
              <div className="grid gap-4">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 w-32">
                      <div style={{ color: typeColor }}>
                        {getStatIcon(stat.stat.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {getStatLabel(stat.stat.name)}
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: typeColor,
                          width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="w-12 text-right font-bold text-gray-800 dark:text-white">
                      {stat.base_stat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;