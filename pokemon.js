const MAX_POKEMON = 151; //maximum amount of pokemon we're gonna retrieve from the pokemon API
const listWrapper = document.querySelector(".list-wrapper"); //referencing the HTML elements. The place we insert pokemon.
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = []; //Empty array. Where we store all the pokemons when we have to retrieve them.

