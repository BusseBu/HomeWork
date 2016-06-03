export default class FormAlert {
    constructor(options) {

        let input = options.input;
        let form = input.closest("form");

        let error = form.querySelector(".form-alert");
        if (error) {
            error.parentNode.querySelector("input").className.replace(" error", "");
            error.remove();
        }

        let div = document.createElement("div");
        div.className = "form-alert";
        div.innerHTML = options.message;
        input.parentNode.appendChild(div);

        this._elem = div;

        let oldClassName = input.className;
        input.className += " error";

        input.onfocus = () => {
            this._elem.remove();
            input.className = oldClassName;
            input.onfocus = "";
        }

    }
}