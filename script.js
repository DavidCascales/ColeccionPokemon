let offset = 0;

function fetchPokemons(offset) {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=16&offset=${offset}`)
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById('pokemonGrid');
            grid.innerHTML = '';
            // Ordenar Pokémon por ID
            const orderedPokemons = data.results.map((pokemon, index) => ({
                ...pokemon,
                id: offset + index + 1  // Agregar el ID basado en el offset
            })).sort((a, b) => a.id - b.id);

            orderedPokemons.forEach(pokemon => {
                fetch(pokemon.url)  // Solicitar detalles del Pokémon
                    .then(response => response.json())
                    .then(pokemonData => {
                        const pokemonDiv = document.createElement('div');
                        pokemonDiv.className = 'pokemon';
                        pokemonDiv.style.backgroundImage = `url(${pokemonData.sprites.front_default})`;  // Imagen del sprite
                       
                        grid.appendChild(pokemonDiv);
                    })
                    .catch(error => console.log('Error al obtener los detalles del Pokémon:', error));
            });
        })
        .catch(error => console.log('Error:', error));
}

function changePage(direction) {
    if (direction === 'next') {
        offset += 16;
    } else if (direction === 'previous' && offset > 0) {
        offset -= 16;
    }
    fetchPokemons(offset);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPokemons(offset);  // Initial fetch
});
