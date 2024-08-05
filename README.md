# Pokedex
Pokémon dictionary with 151 pokémon species. The application fetches data from the PokeAPI and displays a list of Pokémon with search and sorting functionalities. It's possible to add up till 1,025 pokémon but for now, we'll just fetch the first 151.

The Pokémon dictionary is made in HTML, CSS, and JavaScript. It fetches data from the PokeAPI.

The project has the following components:
- API Configuration
- UI Rendering
- Search Panel
- Sorting Functionality
- Filters
- Pokémons Details 🌟

# Documentation
## HTML Code
The HTML code defines the structure of the Pokedex application, including the header, search bar, sorting options, and the main section where the Pokémon list is displayed.

Head Section
- Main Section: Contains the main content of the Pokedex application.
- Header: Includes the logo, search bar, and sorting options.
- Logo Wrapper: Displays the Pokedex logo.
- Search Wrapper: Contains the search input and close icon.
- Sort Wrapper: Provides sorting options by number or name.
- Pokemon List Section: Displays the list of Pokémon.
- Container: Wraps the Pokémon list.
- List Wrapper: Holds the dynamically generated Pokémon items.
- Not Found Message: Displays a message if no Pokémon match the search criteria.

## JavaScript Code
The JavaScript code provides the functionality to fetch Pokémon data from the PokeAPI, display it, and implement search and sorting features.

### Variables
- MAX_POKEMON: The maximum number of Pokémon to fetch from the API (151).
- listWrapper: The HTML element where Pokémon items will be inserted.
- searchInput: The search input field.
- numberFilter: The radio button to sort by number.
- nameFilter: The radio button to sort by name.
- notFoundMessage: The message displayed when no Pokémon are found.
- allPokemons: An array to store the fetched Pokémon data.

### Fetching Pokémon Data
The fetch function retrieves data from the PokeAPI and stores it in allPokemons. The displayPokemons function is then called to display the Pokémon.

### Fetching Detailed Pokémon Data
The fetchPokemonDataBeforeRedirect function fetches detailed data for a specific Pokémon before redirecting to its detail page.

### Displaying Pokémon
The displayPokemons function creates and inserts HTML elements for each Pokémon into the listWrapper.

### Search Functionality
The handleSearch function filters the Pokémon based on the search input and updates the displayed list.
