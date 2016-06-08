import template from './modal.jade';

import './modal.scss';

export default class Modal {
    constructor(options) {
        // Я не передаю элемент, потому что не хочу, чтобы у меня болтались лишние элементы на странице
        // Я хочу создать элемент с заданным id. Также этот id используется для создания экземпляра класса
        // с нужными параметрами

        // Создаем базовое окно
        Modal._createModal(options);
        this._elem = document.querySelector("#" + options.id);

        // Получаем функцию для генерации HTML-шаблона
        this._template = options.template();

        // Устанавливаем контент окна
        this.setWindowContent(options);

        // Привязываем обработчики к окну
        this._bindHandlers(options.modalHandler);
    }

    static getModal(type, data) {
        // Если такое окно уже есть, обновляем его содержимое и возвращаем

        let options = this.prototype["_" + type];

        if (Modal.windows[type]) {
            Modal.windows[type].setWindowContent(data);
            return Modal.windows[type];
        }

        // Если нет, добавляем к фиксированным свойствам переданные параметры и создаем новое
        if (data) {
            for (let key in data) {
               options[key] = data[key];
            }
        }
        Modal.windows[type] = new Modal(options);
        return Modal.windows[type];
    }

    setWindowContent(data) {
        this._elem.querySelector(".modal-window__content").innerHTML = this._template(data);
    }

    get _userCreate() {
        return {
            id: "user-create",
            template: () => {
               return require("./templates/user-create/user-create.jade")
            },
            modalHandler: () => {
                return require('./templates/user-create');
            }
        }
    }

    get _userEdit() {
        return {
            id: "user-edit",
            template: () => {
                return require("./templates/user-edit/user-edit.jade")
            },
            modalHandler: () => {
                return require('./templates/user-edit');
            }
        }
    }

    _bindHandlers(handler) {
        this._elem.querySelector('.modal-window__close').addEventListener("click", () => {
            this.closeModal();
        });

        this._elem.addEventListener("click", () => {
            if (!event.target.closest(".modal-window__container")) {
                this.closeModal();
            }
        });

        handler().call(this);

    }

    static _createModal(options) {
        let modal = Modal.template(options);
        document.body.insertAdjacentHTML('afterBegin', modal);
    }

    static _getBackground() {
        let background = document.querySelector(".background-fixed");
        if (!background) {
            let div = document.createElement("div");
            div.className = "background-fixed";
            document.body.appendChild(div);
            background = document.querySelector(".background-fixed");
        }
        return background;
    }

    openModal() {
        let background = Modal._getBackground();
        background.style.display = "block";

        this._elem.style.display = "block";
        this._elem.querySelector(".modal-window__container").style.transform = "translate(0, 0)";
    }

    closeModal() {
        let background = Modal._getBackground();
        background.style.display = "none";

        this._elem.querySelector(".modal-window__container").style.transform = "translate(0, -300px)";
        setTimeout(() => {
            this._elem.style.display = "none";
        }, 300);
    }
}

Modal.windows = {};

Modal.template = template;

