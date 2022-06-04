import icons from "../../img/icons.svg"; // Adding icons root folder.
import View from "./views";

class bookmarkView extends View {
  _parentEl = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
  _generateMarkup() {
    // return this._data
    //   .map((result) => this._generateMarkupPreview(result))
    //   .join("");
    // Same as above
    return this._data.map(this._generateMarkupPreview).join("");
  }

  _generateMarkupPreview(result) {
    return ` <li class="preview">
    <a class="preview__link" href="#${result.id}">
      <figure class="preview__fig">
        <img src="${result.image}" alt="Test" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${result.title}</h4>
        <p class="preview__publisher">${result.publisher}</p>
        <!-- <div class="preview__user-generated">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>  -->
      </div>
    </a>
  </li>>`;
  }

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
}

export default new bookmarkView();
