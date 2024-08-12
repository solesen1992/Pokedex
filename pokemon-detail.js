/**
 * This code is used to display Pokémon details.
 * It fetches Pokémon data from the PokeAPI, displays the details, and allows navigation between different Pokémon.
 * 
 * Main functionalities:
 * - Fetch and display Pokémon details including name, ID, types, weight, height, abilities, and stats.
 * Change the background color based on the Pokémon's type.
 * Navigate between Pokémon using left and right arrow buttons.
 * Change the URL without reloading the page for a single-page application experience.
 * Handle fetching errors and log them to the console.
*/

// Variables
let currentPokemonId = null; // Starts with nothing.

// Run this piece of code when we run the page
document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMONS = 649; // Maximum number of Pokémon
    const pokemonId = new URLSearchParams(window.location.search).get("id"); // Gets the pokemonID. Gets it as a String.
    const id = parseInt(pokemonId, 10); // Turns the String into a normal number.

    if (id < 1 || id > MAX_POKEMONS) { // If the id is smaller than 1 or bigger than the max pokemonID.
        return (window.location.href = "./index.html"); // Return to the main page
    }

    currentPokemonId = id; // Set the current Pokemon ID
    loadPokemon(id); // Load the Pokémon data
});

/**
 * Loading of the pokemon
 * @param {*} id
 * @returns
 */
async function loadPokemon(id) {
    try {
        // Fetches both Pokémon and Pokémon species data concurrently.
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`) // Fetch Pokémon data
            .then((res) => res.json()), // Converts the Pokémon data response to JSON format
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`) // Fetch Pokémon species data
            .then((res) => res.json()), // Converts the Pokémon species data response to JSON format
        ]);

        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
        abilitiesWrapper.innerHTML = ""; // Clear information about the previous pokemon

        if (currentPokemonId === id) { // Check if the current Pokemon ID matches the requested ID
            displayPokemonDetails(pokemon); // Display Pokémon details
            const flavorText = getEnglishFlavorText(pokemonSpecies); // Get English flavor text
            document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText; // Set the flavor text

            const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
                document.querySelector(sel)
            );

            // Calls the navigatePokemon function when we click the left and right arrow
            leftArrow.removeEventListener("click", navigatePokemon); // Remove previous event listener
            rightArrow.removeEventListener("click", navigatePokemon); // Remove previous event listener

            if (id !== 1) { // If not the first Pokémon
                leftArrow.addEventListener("click", () => {
                    navigatePokemon(id - 1); // Navigate to the previous Pokémon
                });
            }
            if (id !== 649) { // If not the last Pokémon
                rightArrow.addEventListener("click", () => {
                    navigatePokemon(id + 1); // Navigate to the next Pokémon
                });
            }

            // Changes the URL without reloading the page. Useful for single-page applications.
            window.history.pushState({}, "", `./detail.html?id=${id}`);
        }

        return true;
    } catch (error) { // Catch any errors that occur during the fetch
        console.error("An error occured while fetching Pokemon data:", error); // Log the error
        return false;
    }
}

// Navigate to the specified Pokémon ID
async function navigatePokemon(id) {
    currentPokemonId = id; // Set the current Pokémon ID
    await loadPokemon(id); // Load the Pokémon data
}

/**
 * Holds all the different colors for the background. When the type changes, the background color changes too.
 */
const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8B0",
    dark: "#EE99AC",
}

// Set styles for multiple elements
function setElementStyles(elements, cssProperty, value) {
    elements.forEach((element) => {
        element.style[cssProperty] = value; // Set the CSS property value
    });
}

/**
 * Hex color used in main stats.
 * Convert hex color to rgba color.
 * @param {*} hex
 */
function rgbaFromHex(hexColor) {
    return [
        parseInt(hexColor.slice(1, 3), 16), // Red component
        parseInt(hexColor.slice(3, 5), 16), // Green component
        parseInt(hexColor.slice(5, 7), 16), // Blue component
    ].join(", "); // Join components with a comma
}

// Set the background color based on Pokémon type
function setTypeBackgroundColor(pokemon) {
    const mainType = pokemon.types[0].type.name; // Get the main type of the Pokémon
    const color = typeColors[mainType]; // Get the color for the type

    if (!color) { // If color is not defined
        console.warn(`Color not defined for type: ${mainType}`); // Log a warning
        return;
    }

    const detailMainElement = document.querySelector(".detail-main"); // Get the main detail element
    setElementStyles([detailMainElement], "backgroundColor", color); // Set background color
    setElementStyles([detailMainElement], "borderColor", color); // Set border color

    setElementStyles(document.querySelectorAll(".power-wrapper > p"), "backgroundColor", color); // Set power wrapper background color
    setElementStyles(document.querySelectorAll(".stats-wrap p.stats"), "color", color); // Set stats text color
    setElementStyles(document.querySelectorAll(".stats-wrap .progress-bar"), "color", color); // Set progress bar color

    const rgbaColor = rgbaFromHex(color); // Convert hex color to rgba
    const styleTag = document.createElement("style"); // Create a new style tag
    styleTag.innerHTML = `
        .stats-wrap .progress-bar::-webkit-progress-bar {
            background-color: rgba(${rgbaColor}, 0.5); // Set progress bar background color
        }
        .stats-wrap .progress-bar::-webkit-progress-value {
            background-color: ${color}; // Set progress value color
        }
    `;
    document.head.appendChild(styleTag); // Append style tag to head
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase(); // Capitalize first letter
}

// Create and append an element to the parent
function createAndAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag); // Create a new element
    Object.keys(options).forEach((key) => {
        element[key] = options[key]; // Set element options
    });
    parent.appendChild(element); // Append element to parent
    return element; // Return the created element
}

// Display Pokémon details
function displayPokemonDetails(pokemon) {
    const { name, id, types, weight, height, abilities, stats } = pokemon; // Destructure Pokémon data
    const capitalizePokemonName = capitalizeFirstLetter(name); // Capitalize Pokémon name

    document.querySelector("title").textContent = capitalizePokemonName; // Set the document title

    const detailMainElement = document.querySelector(".detail-main"); // Get the main detail element
    detailMainElement.classList.add(name.toLowerCase()); // Add Pokémon name as a class

    document.querySelector(".name-wrap .name").textContent = capitalizePokemonName; // Set Pokémon name

    document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`; // Set Pokémon ID

    const imageElement = document.querySelector(".detail-img-wrapper img"); // Get the image element
    imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`; // Set image source
    imageElement.alt = name; // Set image alt text

    const typeWrapper = document.querySelector(".power-wrapper"); // Get the type wrapper
    typeWrapper.innerHTML = ""; // Clear type wrapper
    types.forEach(({ type }) => {
        createAndAppendElement(typeWrapper, "p", { className: `body3-fonts type ${type.name}`, textContent: type.name, }); // Add type elements
    });

    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight").textContent = `${weight / 10} kg`; // Set Pokémon weight
    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height").textContent = `${height / 10} m`; // Set Pokémon height

    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move"); // Get abilities wrapper
    abilities.forEach(({ ability }) => {
        createAndAppendElement(abilitiesWrapper, "p", {
            className: "body3-fonts",
            textContent: ability.name, // Add ability elements
        });
    });

    const statsWrapper = document.querySelector(".stats-wrapper"); // Get stats wrapper
    statsWrapper.innerHTML = ""; // Clear stats wrapper

    const statNameMapping = { // Map stat names
        hp: "HP",
        attack: "ATTACK",
        defense: "DEFENCE",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPEED",
    };

    stats.forEach(({ stat, base_stat }) => {
        const statDiv = document.createElement("div"); // Create stat div
        statDiv.className = "stats-wrap"; // Set stat div class
        statsWrapper.appendChild(statDiv); // Append stat div to wrapper

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts stats",
            textContent: statNameMapping[stat.name], // Add stat name
        });

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts",
            textContent: String(base_stat).padStart(3, "0"), // Add stat value
        });

        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100, // Add progress bar
        });
    });

    setTypeBackgroundColor(pokemon); // Set type background color
}

// Get English flavor text from Pokémon species data
function getEnglishFlavorText(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries) { // Iterate through flavor text entries
        if (entry.language.name === "en") { // Check if the language is English
            let flavor = entry.flavor_text.replace(/\\f/g, " "); // Replace line breaks
            return flavor; // Return flavor text
        }
    }
    return ""; // Return empty string if no English entry is found
}
