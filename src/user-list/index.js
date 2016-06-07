import Modal from '../modal';
import UserRequest from '../user-requests';

export default class UserList {
    constructor() {}

    static createNewList(id) {
        let list = document.querySelector("#user-list_" + id);
        if (!list) {
            let list = document.createElement("ul");
            list.id = "user-list_" + id;
            list.className = "user-list";

            document.querySelector('.list-container').appendChild(list);
            UserList._template = require('./user-list.jade');

            document.querySelector(".user-add").addEventListener("click", () => {
                let modal = Modal.getModal('userCreate', {
                    userId: id
                });
                modal.openModal();
            });

            UserList.setListContent(id);
        }
    }


    static setListContent(id) {
        let list = document.querySelector("#user-list_" + id);
        if (!list) return;

        list.innerHTML = "";

        document.querySelector(".loading-gif").style.display = "block";

        UserRequest.getUsers(id, (result) => {
            let users = JSON.parse(result);

            for (let key in users) {
                let li = UserList._template(users[key]);
                list.insertAdjacentHTML('beforeEnd', li);
            }

            list.addEventListener("click", (event) => {
                event.preventDefault();
                let eTarget = event.target;
                let item = eTarget.closest(".user-list__item");
                let user = item.getAttribute("data-id");

                if (item) {
                    if (eTarget.closest(".user-list__edit-item--edit")) {
                        UserList.editUser(id, user);
                    }
                    if (eTarget.closest(".user-list__edit-item--delete")) {
                        let user = item.getAttribute("data-id");
                        if (confirm("Вы точно желаете удалить этого пользователя?")) {
                            UserRequest.deleteUser(id, user, () => {
                                item.remove();
                            });
                        }
                    }
                }
            });

            document.querySelector(".loading-gif").style.display = "none";
        });
    }

    static editUser(id, user) {
        let data = {};

        UserRequest.getUser(id, user, (result) => {
            let user = JSON.parse(result);

            if (user.birthdate) {
                let date = new Date(user.birthdate);
                let days = date.getDate();
                if (days < 10) days = "0" + days;
                let month = date.getMonth() + 1;
                if (month < 10) month = "0" + month;
                user.birthdate = date.getFullYear() + "-" + month + "-" + days;
            }

            user.userId = id;

            let modal = Modal.getModal('userEdit', user);
            modal.openModal();
        });
    }

    static updateUser(form) {
        let data = {};

        Array.prototype.forEach.call(form.elements, (el) => {
            if (el.value) {
                if (el.type == "radio" && el.checked) {
                    data[el.name] = el.value;
                } else if (el.value && el.type !== "radio") {
                    data[el.name] = el.value;
                }
            }
        });

        UserRequest.updateUser(id, user, data, UserList.setListContent.bind(null, id));

    }
}

UserList.users = {};