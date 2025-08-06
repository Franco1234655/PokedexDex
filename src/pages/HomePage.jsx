import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPokemonList, fetchPokemon } from '../utils/pokemonApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPokemons, setTotalPokemons] = useState(0);
  const pokemonsPerPage = 20;

  useEffect(() => {
    loadPokemons();
  }, [currentPage]);

  const loadPokemons = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * pokemonsPerPage;
      const response = await fetchPokemonList(pokemonsPerPage, offset);
      setTotalPokemons(response.count);
      
      const pokemonPromises = response.results.map(async (pokemon) => {
        return await fetchPokemon(pokemon.name);
      });
      
      const pokemonData = await Promise.all(pokemonPromises);
      setPokemons(pokemonData);
    } catch (error) {
      console.error('Erreur lors du chargement des Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchTerm(query);
    
    if (!query.trim()) {
      loadPokemons();
      return;
    }

    try {
      setLoading(true);
      const pokemon = await fetchPokemon(query.toLowerCase());
      setPokemons([pokemon]);
    } catch (error) {
      console.error('Pokémon non trouvé:', error);
      setPokemons([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonClick = (pokemon) => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  const totalPages = Math.ceil(totalPokemons / pokemonsPerPage);
  const canGoToPreviousPage = currentPage > 1;
  const canGoToNextPage = currentPage < totalPages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
                Pokédex
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Découvrez le monde fantastique des Pokémon ! Explorez leurs caractéristiques, évolutions et capacités uniques.
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">{totalPokemons}</div>
              <div className="text-gray-600 dark:text-gray-300">Pokémon au total</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">18</div>
              <div className="text-gray-600 dark:text-gray-300">Types différents</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">9</div>
              <div className="text-gray-600 dark:text-gray-300">Générations</div>
            </div>
          </div>

          {/* Pokemon Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : pokemons.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {pokemons.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={() => handlePokemonClick(pokemon)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {!searchTerm && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={!canGoToPreviousPage}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Précédent
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-300">
                      Page {currentPage} sur {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={!canGoToNextPage}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    Suivant
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Aucun Pokémon trouvé
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Essayez un autre nom ou numéro de Pokémon
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  loadPokemons();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Voir tous les Pokémon
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;