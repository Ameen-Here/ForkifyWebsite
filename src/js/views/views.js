import icons from "../../img/icons.svg"; // Adding icons root folder.

// Parent Class
export default class View {
  _data; // TO store data of state

  /**
   * Render the recieved Object to DOM
   * @param {Object | Object[]} data The data to be rendered
   * @returns {string} A markup string is returned
   * @this {Object} View instance
   * @author Ameen Noushad
   * @todo Finish user icon
   */

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    this._clear();

    this._parentEl.insertAdjacentHTML("afterbegin", markup); // Adding recipe html to the container
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElement = Array.from(this._parentEl.querySelectorAll("*"));

    // Update Changed text
    newElements.forEach((newEl, i) => {
      const curEl = curElement[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // updatechanged attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  // For some reason when I write the below code, things don't work
  //   renderSpinner() {
  //     const spinnerMarkup = `
  //        <div class="spinner">
  //         <svg>
  //           <use href="${icons}.svg_icon-loader"></use>
  //         </svg>
  //       </div>
  //     `;
  //     this._clear();
  //     this._parentEl.insertAdjacentHTML("afterbegin", spinnerMarkup);
  //   }

  renderSpinner() {
    const spinnerMarkup = `
       <div class="spinner">
        <svg>
          <use href="${icons}.svg#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", spinnerMarkup);
  }

  renderError(message = this._errorMessage) {
    const errorMarkup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", errorMarkup);
  }

  renderMessage(message = this._message) {
    const errorMarkup = `
      <div class="message">
              <div>
                <svg>
                  <use href="${icons}.svg_icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", errorMarkup);
  }
  _clear() {
    this._parentEl.innerHTML = "";
  }
}
