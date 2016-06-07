import UserList from '../../../user-list';
import UserRequest from '../../../user-requests';
import Alert from '../../../form-alert';

module.exports = function() {
    this._elem.addEventListener("click", (event) => {
        let eTarget = event.target;
        if (eTarget.closest("[type='submit']")) {
            event.preventDefault();

            let form = document.forms.useredit;

            if (Alert.checkRequired(form) && Alert.checkEmail(form.querySelector('input[name=email]'))) {
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

                let id = form.getAttribute("data-id");

                UserRequest.updateUser(id, form.getAttribute("data-user-id"), user, UserList.setListContent.bind(null, id));
                this.closeModal();
            }
        }
    });
}

