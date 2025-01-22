import React, { useEffect, useState, ChangeEvent } from 'react';
import './App.css';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

const App: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        const pokemonDetails: Pokemon[] = await Promise.all(
          data.results.map(async (poke: { url: string }) => {
            const pokeResponse = await fetch(poke.url);
            return await pokeResponse.json();
          })
        );

        setPokemon(pokemonDetails);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };

    fetchPokemon();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredPokemon = pokemon.filter((poke) =>
    poke.name.toLowerCase().includes(search)
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 display-4 text-primary">Pokémon Gallery</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={handleSearch}
          className="form-control form-control-lg"
        />
      </div>
      <div className="row">
        {filteredPokemon.map((poke) => (
          <div key={poke.id} className="col-md-3 mb-4">
            <div className="card h-100 text-center shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title text-capitalize mb-0">{poke.name}</h5>
              </div>
              <img
                src={poke.sprites.front_default}
                alt={poke.name}
                className="card-img-top mx-auto mt-3"
              />
              <div className="card-body">
                <p className="text-muted">ID: {poke.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;