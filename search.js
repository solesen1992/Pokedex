/**
* This script handles the functionality for a search input, a search close icon, and a sort wrapper in a web application.
*/

// Select the search input element by its ID
const inputElement = document.querySelector("#search-input");

// Select the search close icon element by its ID
const search_icon = document.querySelector("#search-close-icon");

// Select the sort wrapper element by its class
const sort_wrapper = document.querySelector(".sort-wrapper");

// Add an event listener to the input element to handle input changes
inputElement.addEventListener("input", () => {
    handleInputChange(inputElement); // Call the handleInputChange function
});

// Add an event listener to the search icon to handle click events
search_icon.addEventListener("click", handleSearchCloseOnClick); // Call the handleSearchCloseOnClick function

// Add an event listener to the sort wrapper to handle click events
sort_wrapper.addEventListener("click", handleSortIconOnClick); // Call the handleSortIconOnClick function


/***
 * Function to handle input changes in the search input element.
 * It shows the search close icon if the input is not empty,
 * and hides the icon if the input is empty.
***/
function handleInputChange(inputElement) {
    const inputValue = inputElement.value; // Get the current value of the input element

    if (inputValue !== "") { // If the input is not an empty string
        // Add a class to make the search close icon visible
        document.querySelector("#search-close-icon").classList.add("search-close-icon-visible");
    } else {
        // Remove the class to hide the search close icon
        document.querySelector("#search-close-icon").classList.remove("search-close-icon-visible");
    }
}

/**
 * Function to handle click events on the search close icon.
 * It clears the search input and hides the search close icon.
*/
function handleSearchCloseOnClick() {
    // Clear the value of the search input element
    document.querySelector("#search-input").value = "";
    // Remove the class to hide the search close icon
    document.querySelector("#search-close-icon").classList.remove("search-close-icon-visible");
}

/**
 * Function to handle click events on the sort wrapper.
 * It toggles the visibility of the filter wrapper and
 * adds/removes an overlay on the body.
*/
function handleSortIconOnClick() {
    // Toggle the class to open/close the filter wrapper
    document.querySelector(".filter-wrapper").classList.toggle("filter-wrapper-open");
    // Toggle the class to add/remove an overlay on the body
    document.querySelector("body").classList.toggle("filter-wrapper-overlay");
}
