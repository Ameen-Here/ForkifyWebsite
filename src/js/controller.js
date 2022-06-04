import * as model from "./model.js";

import recipeViews from "./views/recipeViews";
import searchViews from "./views/searchViews";
import resultViews from "./views/resultViews";
import paginationViews from "./views/paginationViews.js";
import addRecipeView from "./views/addRecipeView.js";

import bookmarkView from "./views/bookmarksView.js";

import { MODAL_CLOSE_SEC } from "./config.js";

// Pollyfilling after babel [Done bey parcel]
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime/runtime";

//  To prevent reloading by parcel
// if (module.hot) {
//   module.hot.accept();
// }

//  Rendering recipe according to the hash id in URL
const controllerRecipe = async function () {
  try {
    const id = window.location.hash.slice(1); // Getting the hash id from URL
    if (!id) return; // Gaurd clause

    // Spinner Animation
    recipeViews.renderSpinner();

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe to the screen
    recipeViews.render(model.state.recipe);
  } catch (err) {
    recipeViews.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // 1) Get search query
    const query = searchViews.getQuery();
    if (!query) return;
    resultViews.renderSpinner();

    // 2)  Load search result
    await model.loadSearchResult(query);

    // 3) Render Result
    resultViews.render(model.getSearchResultsPage());

    // Render Pagination
    paginationViews.render(model.state.search);
  } catch (err) {
    throw err;
  }
};

const controlPagination = async function (btnElement) {
  // Check and implement next and previous page
  if (btnElement.classList.contains("pagination__btn--next"))
    model.state.search.page++;
  else model.state.search.page--;

  // Render search
  resultViews.render(model.getSearchResultsPage());

  // Render Pagination
  paginationViews.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the serving and ingredients quantity
  model.upgradeServings(newServings);

  // Rendering recipe to the screen with update ingredient
  recipeViews.update(model.state.recipe);
};

const controlBookmark = function () {
  // Looking whether its bookmarked or not
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeViews.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarkReload = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlUpload = async function (data) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(data);

    // Render recipe
    recipeViews.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Change id in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Render bookmarks
    bookmarkView.render(model.state.bookmarks);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarkReload);
  recipeViews.addHandlerRender(controllerRecipe);
  recipeViews.addHandlerUpdateServ(controlServings);
  recipeViews.addBookmarkHandler(controlBookmark);
  searchViews.addHandlerSearch(controlSearchResult);
  paginationViews.addHandlePagination(controlPagination);
  addRecipeView.addHandlerUpload(controlUpload);
};

init();
