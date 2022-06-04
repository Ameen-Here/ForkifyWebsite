import icons from "../../img/icons.svg"; // Adding icons root folder.
import View from "./views";

class PaginationView extends View {
  _parentEl = document.querySelector(".pagination");

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );
    // Conditions:

    // Page 1 and other pages
    if (curPage === 1 && numPages > 1) {
      return `
            <button class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button>
      `;
    }

    // Last Page
    if (curPage === numPages && numPages > 1) {
      return `
            <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
            </button>
      `;
    }

    // Other pages
    if (curPage < numPages) {
      return `
                <button class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
                <button class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
      `;
    }

    // Page 1 and no other page
    return "";
  }

  addHandlePagination(handler) {
    this._parentEl.addEventListener("click", function (e) {
      e.preventDefault();
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      handler(btn);
    });
  }
}

export default new PaginationView();
