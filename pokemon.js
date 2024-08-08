/** 
 * This JavaScript class interacts with the Pokémon API to retrieve and display a list of Pokémon, allowing users to search and view 
 * details of individual Pokémon.
 * 
 * Fetching Pokémon Data
 * The code fetches data from the Pokémon API using fetch and retrieves up to MAX_POKEMON Pokémon.
 * The Pokémon data is stored in the allPokemons array and then displayed on the webpage using the displayPokemons function.
 * 
 * Displaying Pokémon
 * displayPokemons(pokemon): This function clears the current list and dynamically creates a list of Pokémon. 
 * Each Pokémon is displayed with its ID, image, and name.
 * Clicking on a Pokémon triggers an asynchronous function, fetchPokemonDataBeforeRedirect(id), which fetches additional 
 * data before redirecting to a detailed page.
 * 
 * Search Functionality
 * Users can search for Pokémon by name or ID using the handleSearch function, which filters the list based on the search input 
 * and selected filter (number or name). If no Pokémon match the search, a "Not Found" message is displayed.
 * 
 * Clearing Search
 * The clearSearch function allows users to reset the search input and display the full list of Pokémon again.
 * 
 * Event Listeners
 * The code adds event listeners for search input, search filtering, and clearing the search.
*/

/**
 * Variables that will be used in the code
*/
const MAX_POKEMON = 649; //maximum amount of pokemon we're gonna retrieve from the pokemon API
const listWrapper = document.querySelector(".list-wrapper"); // Reference to the HTML element where the list of Pokémon will be displayed.
const searchInput = document.querySelector("#search-input"); // Reference to the search input field for filtering Pokémon.
const numberFilter = document.querySelector("#number"); // Reference to the radio button for filtering Pokémon by number.
const nameFilter = document.querySelector("#name"); // Reference to the radio button for filtering Pokémon by name.
const notFoundMessage = document.querySelector("#not-found-message"); // Reference to the "Not Found" message element.

let allPokemons = []; // An empty array to store all retrieved Pokémon.


/** 
 * Fetches Pokémon data from the API, limited by the MAX_POKEMON variable.
 * It shows the amount of pokemon, we have chosen in the MAX_POKEMON variable.
 */
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json()) // Converts the API response to JSON format.
// Takes the data we receive. Receives the raw data from the pokemon API.
.then((data) => { 
    allPokemons = data.results; // Stores the retrieved Pokémon data in the allPokemons array.
    // To show what we are receiving from the API 
    // Uncomment the following lines to log data to the console for debugging purposes.
    // console.log(data);
    // console.log(data.results);
    // console.log(data.results[0]);
    // console.log(data.results[0].name);
    // console.log(data.results[0].name.url);
    // To show the pokemons
    // console.log(allPokemons);
    displayPokemons(allPokemons); // Displays the list of all retrieved Pokémon on the page.
});

/** 
 * Async function to fetch detailed data for a specific Pokémon before redirecting.
 * When we click on a pokemon, we use this function. It takes some time before the pokemon data is fetched from the API.
 * It takes some time for the data to show up from the pokeapi.
 * async allows us to run some code and delay the next line of javascript code until we have retrieved the data that we want/need
 * have to use async functions in bigger programs
 */
async function fetchPokemonDataBeforeRedirect(id) {
    try {
        // Fetches both Pokémon and Pokémon species data concurrently.
        // this is a promise that you're gonna receive from data. It's gonna come from here. We will receive it and turn it into json so we can read it.
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((res) =>
            res.json() // Converts the Pokémon data response to JSON format.
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then((res) => 
            res.json() // Converts the Pokémon species data response to JSON format.
        ),
    ])
    //If it works and we retrieve the data, return true.
    return true; // Returns true if data fetching is successful.
    } catch(error) {
        console.error("Failed to fetch Pokemon data before redirect"); // Logs an error message if data fetching fails.
    }
}



/**
 * Function to display the list of Pokémon. Fetches the pokemon list.
*/ 
function displayPokemons(pokemon) {
    // Every time we fetch, we're gonna clear the inner HTML.
    listWrapper.innerHTML = ""; // Clears the existing content in the listWrapper element.
    pokemon.forEach((pokemon) => { // Iterates over each Pokémon in the array.
        // After the sixt slash / in the pokemon url
        const pokemonID = pokemon.url.split("/")[6]; // Extracts the Pokémon ID from its URL.
        const listItem = document.createElement("div"); // Creates a new div element for the Pokémon list item.
        // List item is the box the pokemon image and name is in on the front page / index site.
        listItem.className = "list-item"; // Assigns a class name to the list item for styling.
        // Creating the HTML that is inside every list item.
        // Sets the inner HTML of the list item to include the Pokémon's number, image, and name.
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fronts">#${pokemonID}</p>
            </div>
            <div class="image-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
            </div>
            <div class="name-wrap">
                <p class="body3-fronts">#${pokemon.name}</p>
            </div>
        `;

        // Takes us to the detail page of every pokemon when we click on it from the main page
        // Adds a click event listener to the list item to fetch detailed data and redirect to the Pokémon's detail page.
        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonID); // Fetches detailed data for the Pokémon.
            if (success) {
                //redirects the window
                window.location.href = `./detail.html?id=${pokemonID}`; // Redirects to the Pokémon's detail page if data fetching is successful.
            }
        });

        // Adds all the list items to the list wrapper (so it adds all the pokemons)
        // Appends the list item to the listWrapper element, adding it to the displayed list.
        listWrapper.appendChild(listItem);
    });
}


/**
 * Adds an event listener to the search input field that triggers the handleSearch function on keyup.
 */
searchInput.addEventListener("keyup", handleSearch);

/**
 * Function to handle the search functionality.
 */
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase(); // Converts the search input to lowercase for case-insensitive comparison.
    let filteredPokemons; // Variable to store the filtered Pokémon list.

    if(numberFilter.checked) { // Checks if the number filter is selected.
        filteredPokemons = allPokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6]; // Extracts the Pokémon ID from its URL.
            return pokemonID.startsWith(searchTerm); // Filters Pokémon by ID based on the search term.
        });
    } else if (nameFilter.checked) { // Checks if the name filter is selected.
        filteredPokemons = allPokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(searchTerm) // Filters Pokémon by name based on the search term.
    });
    } else {
        filteredPokemons = allPokemons; // If no filter is selected, display all Pokémon.
    }

    displayPokemons(filteredPokemons); // Displays the filtered list of Pokémon.

    // Displays the "Not Found" message if no Pokémon match the search term.
    if (filteredPokemons.length === 0) {
        notFoundMessage.style.display = "block";
    } else {
        notFoundMessage.style.display = "none";
    }
}

/**
 * Function of the close button for the search input.
 */
const closeButton = document.querySelector(".search-close-icon"); // Reference to the close button for clearing the search input.
closeButton.addEventListener("click", clearSearch); // Adds an event listener to trigger the clearSearch function on click.

/**
 * Function to clear the search input and display all Pokémon
 */
function clearSearch() {
    searchInput.value = ""; // Resets the search input field to an empty string.
    displayPokemons(allPokemons); // Displays the full list of Pokémon.
    notFoundMessage.style.display = "none"; // Hides the "Not Found" message.
}
