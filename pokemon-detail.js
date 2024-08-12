// Variables
let currentPokemonId = null; // Starts with nothing.

// Run this piece of code when we run the page
document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMONS = 649;
    const pokemonId = new URLSearchParams(window.location.search).get("id"); // Gets the pokemonID. Gets it as a String.
    const id = parseInt(pokemonId, 10); // Turns the String into a normal number.

    if (id < 1 || id > MAX_POKEMONS) { // If the id is smaller than 1 or bigger than the max pokemonID.
        return (window.location.href = "./index.html"); // Return to the main page
    }

    currentPokemonId = id;
    loadPokemon(id);
});

/**
 * Loading of the pokemon
 * @param {*} id 
 * @returns 
 */
async function loadPokemon(id) {
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
        ]);

        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
        abilitiesWrapper.innerHTML = ""; // Clear information about the previous pokemon

        if (currentPokemonId === id) {
            displayPokemonDetails(pokemon);
                const flavorText = getEnglishFlavorText(pokemonSpecies);
                document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText;
        
        const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
            document.querySelector(sel)
        );

        // Calls the navigatePokemon function when we click the left and right arrow
        leftArrow.removeEventListener("click", navigatePokemon);
        rightArrow.removeEventListener("click", navigatePokemon);

        if (id !== 1) {
            leftArrow.addEventListener("click", () => {
                navigatePokemon(id - 1);

            });
        }
        if (id !== 649) {
            rightArrow.addEventListener("click", () => {
                navigatePokemon(id + 1);

            });
        }
        /**
         * Changes the url without reloading the page. Useful when we want to switch between the pokemon without reloading the page. 
         * Single page application.
        */
        window.history.pushState({}, "", `./detail.html?id=${id}`); 
        }

        return true;
    }
    catch (error) {
        console.error("An error occured while fetching Pokemon data:", error);
        return false;
    }
}


async function navigatePokemon(id) {
    currentPokemonId = id;
    await loadPokemon(id);
}

/**
 * Holds all the diffent colors in the background. WHen the type changes, the background color changes too.
 * Poison = purple, electric = yellow etc.
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

function setElementStyles(elements, cssProperty, value) {
    elements.forEach((element => {
        element.style[cssProperty] = value;
    }));
}

/**
 * Hex color used in main stats.
 * Turning hex color into rgba color.
 * @param {*} hex 
 */
function rgbaFromHex(hexColor) {
    return [
        parseInt(hexColor.slice(1, 3), 16),
        parseInt(hexColor.slice(3, 5), 16),
        parseInt(hexColor.slice(5, 7), 16),
    ].join(", ");
}

function setTypeBackgroundColor(pokemon) {
    const mainType = pokemon.types[0].type.name;
    const color = typeColors[mainType];

    if (!color) {
        console.warn(`Color not defined for type: ${mainType}`);
        return;
    }

    const detailMainElement = document.querySelector(".detail-main");
    setElementStyles([detailMainElement], "backgroundColor", color);
    setElementStyles([detailMainElement], "borderColor", color);

    setElementStyles(document.querySelectorAll(".power-wrapper > p"), "backgroundColor", color);
    setElementStyles(document.querySelectorAll(".stats-wrap p.stats"), "color", color);
    setElementStyles(document.querySelectorAll(".stats-wrap .progress-bar"), "color", color);

    const rgbaColor = rgbaFromHex(color);
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
        .stats-wrap .progress-bar::-webkit-progress-bar {
            background-color: rgba(${rgbaColor}, 0.5);
        }
        .stats-wrap .progress-bar::-webkit-progress-value {
            background-color: ${color};
        } 
    `;
    document.head.appendChild(styleTag);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    })
    parent.appendChild(element);
    return element;
}

function displayPokemonDetails(pokemon) {
    const { name, id, types, weight, height, abilities, stats } = pokemon;
    const capitalizePokemonName = capitalizeFirstLetter(name);

    document.querySelector("title").textContent = capitalizePokemonName;

    const detailMainElement = document.querySelector(".detail-main");
    detailMainElement.classList.add(name.toLowerCase());

    document.querySelector(".name-wrap .name").textContent = capitalizePokemonName;

    document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`;

    const imageElement = document.querySelector(".detail-img-wrapper img");
    imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`; // main image på detail page
    imageElement.alt = name;

    const typeWrapper = document.querySelector(".power-wrapper");
    typeWrapper.innerHTML = "";
    types.forEach(({ type }) => {
        createAndAppendElement(typeWrapper, "p", { className: `body3-fonts type ${type.name}`, textContent: type.name,});
    });

    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight").textContent = `${weight / 10} kg`; // Weights in the API is 10 times what it should be.
    document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height").textContent = `${height / 10} m`;

    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
    abilities.forEach(({ ability }) => {
        createAndAppendElement(abilitiesWrapper, "p", {
        className: "body3-fonts",
        textContent: ability.name,
        });
    });

    const statsWrapper = document.querySelector(".stats-wrapper");
    statsWrapper.innerHTML = "";

    const statNameMapping = {
        hp: "HP",
        attack: "ATTACK",
        defense: "DEFENCE",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPEED",
    }

    stats.forEach(({stat, base_stat}) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsWrapper.appendChild(statDiv);

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts stats",
            textContent: statNameMapping[stat.name],
        });

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts",
            textContent: String(base_stat).padStart(3, "0"),
        });

        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100,
        });
    });

    setTypeBackgroundColor(pokemon)
}

function getEnglishFlavorText(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries) {
        if (entry.language.name === "en") {
            let flavor = entry.flavor_text.replace(/\f/g, " ");
            return flavor;
        }
    } 
    return "";
}