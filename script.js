let pokemonsData = []; // Guardará los datos de los Pokémon
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const pokedex = document.getElementById("pokedex");
// Obtener todos los Pokémon
function fetchAllPokemons() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0")
    .then((response) => response.json())
    .then((data) => {
      const pokemonPromises = data.results.map((pokemon) => {
        const id = getPokemonId(pokemon.url);
        return fetch(pokemon.url)
          .then((response) => response.json())
          .then((pokemonData) => ({
            id,
            name: pokemon.name,
            image: pokemonData.sprites.front_default,
          }));
      });

      // Esperar a que todos los datos se carguen
      Promise.all(pokemonPromises).then((pokemons) => {
        pokemonsData = pokemons; // Guardamos los datos completos
        renderPokemons(pokemons); // Renderizamos los Pokémon
      });
    })
    .catch((error) => console.log("Error:", error));
}

// Extraer ID del Pokémon desde la URL
function getPokemonId(url) {
  const parts = url.split("/");
  return parseInt(parts[parts.length - 2]);
}

// Renderizar los Pokémon en el DOM
function renderPokemons(pokemons) {
  pokedex.innerHTML = ""; // Limpiar pokedex antes de renderizar

  pokemons.forEach((pokemon) => {
    const pokemonDiv = document.createElement("div");
    pokemonDiv.className = "pokemon";
    pokemonDiv.style.backgroundImage = `url(${pokemon.image})`;
    pokemonDiv.textContent = `#${pokemon.id} ${pokemon.name}`;
    pokedex.appendChild(pokemonDiv);
  });
}

// Función de búsqueda
searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value.toLowerCase();

  // Filtramos los Pokémon que coinciden con la búsqueda
  const filteredPokemons = pokemonsData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchValue)
  );

  if (filteredPokemons.length === 0) {
    pokedex.innerHTML = "<h1>No se encontro ningun pokemon llamado "+ searchValue +"</h1>"; // Mostrar mensaje de error
  } else {
    renderPokemons(filteredPokemons); // Mostrar solo los Pokémon filtrados
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchAllPokemons(); // Cargar Pokémon al iniciar
});
