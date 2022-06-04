import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, API_KEY } from "./config.js";

import { ajax } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    result: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    serving: recipe.servings,
    ...(recipe.id && { key: recipe.id }),
  }; // Refactoring recipe object to avoid _ and other improper properties.
};

export const loadRecipe = async function (id) {
  try {
    const datas = await ajax(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(datas);
    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await ajax(`${API_URL}?search=${query}&key=${API_KEY}`);
    if (data.status !== "success") return;
    state.search.page = 1;
    state.search.result = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.id && { key: rec.id }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function () {
  const start = (state.search.page - 1) * state.search.resultsPerPage;
  const end = state.search.page * state.search.resultsPerPage;
  return state.search.result.slice(start, end);
};

export const upgradeServings = function (newServings) {
  newServings = newServings + state.recipe.serving;
  if (newServings < 1) return;
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.serving;
  });
  state.recipe.serving = newServings;
  // Or we can implement using obtaining update-To dataset from the svg class, we defined the next value or previous vale and just update without newServings = newServings + state.recipe.serving;  Also check servings < 1, there itself
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add recipe to bookmark list
  state.bookmarks.push(recipe);

  // Make current recipe as bookmarked
  state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  // Removing from bookmark list
  state.bookmarks.splice(index, 1);

  state.recipe.bookmarked = false;
  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // Format raw input from form to the form for the api input
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        // const ingArr = ing[1].replaceAll(" ", "").split(",");
        if (ingArr.length < 3) throw new Error("Wrong ingredient format");
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Reformating recipe for sending data
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: newRecipe.cookingTime,
      ingredients,
      servings: newRecipe.servings,
    };

    // Post to api
    const response = await ajax(`${API_URL}?key=${API_KEY}`, recipe);

    //  Adding the upload recipe to state
    state.recipe = createRecipeObject(response);

    // Adding the boookmark
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

const init = function () {
  // Add local storage
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
