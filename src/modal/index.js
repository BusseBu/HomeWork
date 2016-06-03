import template from './modal.jade';

export default class Modal {
    constructor(options) {
        let modal = document.querySelector("#" + options.id);
        if (!modal) this.createModal(options);

        this._elem = document.body.querySelector("#" + options.id);
        this._elem.innerHTML = options.template;

        this.openModal();

        this._clickHandler = this.handleDocumentClick.bind(this);

        setTimeout(() => {
            document.body.addEventListener("click", this._clickHandler);
        }, 300);

        if (options.onClick) {
            this._onClick = options.onClick.bind(this);
            this._elem.addEventListener("click", this._onClick);
        }
        if (options.onFocus) {
            this._elem.addEventListener("focus", options.onFocus.bind(this), true);
        }

    }

    handleDocumentClick(event) {
        if (event.target.closest(".modal-window__content")) return;
        this.closeModal();
        document.body.removeEventListener("click", this._clickHandler);
    }

    createModal(options) {
        let modal = template(options);
        document.body.insertAdjacentHTML('afterBegin', modal);
    }

    openModal() {
        let background = document.querySelector(".background-fixed");

        if (!background) {
            let div = document.createElement("div");
            div.className = "background-fixed";
            document.body.appendChild(div);
            background = document.querySelector(".background-fixed");
        }

        background.style.display = "block";

        this._elem.style.display = "block";
        this._elem.querySelector(".modal-window__content").style.transform = "translate(0, 0)";

    }

    closeModal() {
        let background = document.querySelector(".background-fixed");
        background.style.display = "none";

        this._elem.removeEventListener("click", this._onClick);

        this._elem.querySelector(".modal-window__content").style.transform = "translate(0, -300px)";
        setTimeout(() => {
            this._elem.style.display = "none";
        }, 300);

    }
}