export default class FormAlert {
    constructor(options) {
        this._input = options.input;
        let form = this._input.closest("form");

        // На всякий случай убираем все алерты в текущей форме с нужным нам input
        let error = form.querySelector(".form-alert");
        if (error) {
            error.parentNode.querySelector("input").className.replace(" error", "");
            error.remove();
        }

        this._createAlert(options.message);
        this._addInputHandler();
        this._input.className += " error";
    }

    _createAlert(message) {
        let div = document.createElement("div");
        div.className = "form-alert";
        div.innerHTML = message;
        this._input.parentNode.appendChild(div);

        this._elem = div;
    }

    _addInputHandler() {
        let oldClassName = this._input.className;

        this._input.onfocus = () => {
            this._elem.remove();
            this._input.className = oldClassName;
            this._input.onfocus = "";
        }
    }

    static checkRequired(form) {
        let required = Array.prototype.slice.call(form.querySelectorAll("input[required]"));
        for (let i = 0; i < required.length; i++) {
            if (!required[i].value) {
                new FormAlert({
                    input: required[i],
                    message: "Не заполнено обязательное поле " + required[i].name
                });
                return false;
            }
        }
        return true;
    }

    static checkEmail(input) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(input.value)) {
            new FormAlert({
                input: input,
                message: "Неверный e-mail"
            });
            return false;
        }

        return true;
    }
}