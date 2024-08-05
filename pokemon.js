const MAX_POKEMON = 151; //maximum amount of pokemon we're gonna retrieve from the pokemon API
const listWrapper = document.querySelector(".list-wrapper"); //referencing the HTML elements. The place we insert pokemon.
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = []; //Empty array. Where we store all the pokemons when we have to retrieve them.

// Fetches information from pokeapi.co
// Shows the amount of pokemon we have chosen in the MAX_POKEMON variable
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json()) // Takes the response from the website and do something with that response: Turn it into a json
// Takes the data we receive. Receives the raw data from the pokemon API
.then((data) => {
    allPokemons = data.results;
    // To show what we are receiving from the API 
    // console.log(data);
    // console.log(data.results);
    // console.log(data.results[0]);
    // console.log(data.results[0].name);
    // console.log(data.results[0].name.url);
    // To show the pokemons
    // console.log(allPokemons);
    displayPokemons(allPokemons);
});

// When we click on a pokemon, we use this function. It takes some time before the pokemon data is fetched from the API.
// It takes some time for the data to show up from the pokeapi
// async allows us to run some code and delay the next line of javascript code until we have retrieved the data that we want/need
// have to use async functions in bigger programs
async function fetchPokemonDataBeforeRedirect(id) {
    try {
        // this is a promise that you're gonna receive from data. It's gonna come from here. We will receive it and turn it into json so we can read it.
        const [pokemon, pokemonSpecies] = await Promise.resolve.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((res) =>
            res.json() 
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then((res) => 
            res.json() 
        ),
    ])
    //If it works and we retrieve the data, return true.
    return true; 
    } catch(error) {
        console.error("Failed to fetch Pokemon data before redirect");
    }
}

// Fetch the pokemon list
function displayPokemons(pokemon) {
    // Every time we fetch, we're gonna clear the inner HTML.
    listWrapper.innerHTML = "";
    pokemon.forEach((pokemon) => {
        // After the sixt slash / in the pokemon url
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        // List item is the box the pokemon image and name is in on the front page / index site.
        listItem.className = "list-item";
        // Creating the HTML that is inside every list item.
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class=""caption-fronts">#${pokemonID}</p>
            </div>
            <div class="image-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
            </div>
            <div class="name-wrap">
                <p class=""body3-fronts">#${pokemon.name}</p>
            </div>
        `;

        // Takes us to the detail page of every pokemon when we click on it from the main page
        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonID);
            if (success) {
                //redirects the window
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });

        // Adds all the list items to the list wrapper (so it adds all the pokemons)
        listWrapper.appendChild(listItem);
    });
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;

    if(numberFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm);
        });
    } else if (nameFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().startsWith(searchTerm)
        );
    } else {
        filteredPokemons = allPokemons;
    }
    displayPokemons(filteredPokemons);

    if (filteredPokemons.length === 0) {
        notFoundMessage.style.display = "block";
    } else {
        notFoundMessage.style.display = "none";
    }
}

const closeButton = document.querySelector(."search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
    searchInput.value = ""; //Empty string
    displayPokemons(allPokemons); //Display all pokemons
    notFoundMessage.style.display = "none";
}