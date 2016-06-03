import Modal from '../modal';
import Alert from '../form-alert';

import userTemplate from './user-list.jade';
import userPopup from '../modal/modal-templates/user-edit.jade';
import userCreate from '../modal/modal-templates/user-create.jade';

export default class UserList {
    constructor(options) {
        this._mainUser = options.user;

        document.querySelector(".user-add").addEventListener("click", () => {
            this.addClickHandler();
        });

        this.getUsers();
    }

    addUser(form) {
        let xhr = new XMLHttpRequest;

        xhr.open('POST', 'http://test-api.javascript.ru/v1/' + this._mainUser + "/users", true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        let user = {};
        Array.prototype.forEach.call(form.elements, (el) => {
            if (el.value) {
                if (el.type == "radio" && el.checked) {
                    user[el.name] = el.value;
                } else if(el.type == "date") {
                    let date = new Date(el.value);
                    user[el.name] = date;
                } else if (el.value && el.type !== "radio") {
                        user[el.name] = el.value;
                }
            }
        });

        xhr.send(JSON.stringify(user));

        xhr.onloadend = () => {
            this.getUsers();
        };
    }

    addClickHandler() {
        let self = this;
        new Modal({
            id: "user-new",
            template: userCreate(),
            onClick: function (event) {
                if (event.target.closest(".modal-window__close")) {
                    this.closeModal();
                    document.body.removeEventListener("click",  this._clickHandler);
                }
                if (event.target.closest("[type='submit']")) {
                    event.preventDefault();
                    let alert = self.handleFormErrors();

                    if (!alert) {
                        self.addUser(document.forms.usercreate);
                        this.closeModal();
                        document.body.removeEventListener("click",  this._clickHandler);
                    }
                }
            }
        });
    }

    getUsers() {
        let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        let xhr = new XHR();

        xhr.open('GET', 'http://test-api.javascript.ru/v1/' + this._mainUser + "/users", true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.send();

        document.querySelector(".list-container").innerHTMl = "";
        document.querySelector(".loading-gif").style.display = "block";

        xhr.onloadend = () => {
            document.querySelector(".loading-gif").style.display = "none";
            if (xhr.responseText.length) {
                let users = JSON.parse(xhr.responseText);
                this.makeList(users);
            }
        };
    }

    handleFormErrors() {
        let required = Array.prototype.slice.call(document.querySelectorAll("input[required]"));
        let alert;

        for (let i = 0; i < required.length; i++) {
            if (required[i].name == "email") {
                let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(required[i].value)) {
                    alert = new Alert({
                        input: required[i],
                        message: "Неверный e-mail"
                    });
                    break;
                }
            }
            if (!required[i].value) {
                alert = new Alert({
                    input: required[i],
                    message: "Не заполнено обязательное поле " + required[i].name
                });
                break;
            }
        }

        return alert;
    }


    makeList(users) {
        let jadeUsers = {
            users: users
        }

        let ul = userTemplate(jadeUsers);

        document.querySelector('.list-container').innerHTML = ul;

        document.querySelector(".user-list").addEventListener("click", (event) => {
            let eTarget = event.target;
            if (eTarget.closest(".user-list__edit-item--edit")) {
                this.editUser(event, users);
            }
            if (eTarget.closest(".user-list__edit-item--delete")) {
                this.deleteUser(event);
            }
        });
    }

    editUser(event, users) {
        let id = event.target.closest(".user-list__item").getAttribute("data-id");
        let user = {};

        for (let key in users) {
            if (users[key]["_id"] === id) user.user = users[key];
            if (users[key]["birthdate"]) {
                let date = new Date(users[key]["birthdate"]);
                let days = date.getDate();
                if (days < 10) days = "0" + days;
                let month = date.getMonth() + 1;
                if (month < 10) month = "0" + month;
                users[key]["birthdate"] = date.getFullYear() + "-" + month + "-" + days;
            }
        }

        event.preventDefault();

        let self = this;

        new Modal({
            id: "user-edit",
            template: userPopup(user),
            options: {
                user: user
            },
            onClick: function(event) {
                let eTarget = event.target;
                if (eTarget.closest(".modal-window__close")) {
                    this.closeModal();
                    document.body.removeEventListener("click",  this._clickHandler);
                }
                if (eTarget.closest("[type='submit']")) {
                    event.preventDefault();
                    let alert = self.handleFormErrors();

                    if (!alert) {
                        self.updateUser(document.forms.useredit, id);
                        this.closeModal();
                        document.body.removeEventListener("click",  this._clickHandler);
                    }
                }
            }
        });
    }

    updateUser(form, id) {
        let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        let xhr = new XHR();
        let user = {};

        Array.prototype.forEach.call(form.elements, (el) => {
            if (el.value) {
                if (el.type == "radio" && el.checked) {
                    user[el.name] = el.value;
                } else if (el.value && el.type !== "radio") {
                    user[el.name] = el.value;
                }
            }
        });

        xhr.open('PATCH', 'http://test-api.javascript.ru/v1/' + this._mainUser + "/users/" + id, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.send(JSON.stringify(user));

        xhr.onloadend = () => {
            this.getUsers();
        };
    }

    deleteUser(event) {
       event.preventDefault();
       let eTarget = event.target;
       let id = eTarget.closest(".user-list__item").getAttribute("data-id");

       if (confirm("Вы точно желаете удалить этого пользователя?")) {

           let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
           let xhr = new XHR();

           xhr.open('DELETE', 'http://test-api.javascript.ru/v1/' + this._mainUser + "/users/" + id, true);

           xhr.send();

           xhr.onerror = () => {
               console.error(xhr.statusText);
           };

           xhr.onloadend = () => {
               eTarget.closest(".user-list__item").remove();
           }
       }

    }
}