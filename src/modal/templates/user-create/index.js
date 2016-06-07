import UserList from '../../../user-list';
import UserRequest from '../../../user-requests';
import Alert from '../../../form-alert';

module.exports = function() {
    this._elem.addEventListener("click", (event) => {
        if (event.target.closest("[type='submit']")) {
            event.preventDefault();
            let form = document.forms.usercreate;

            if (Alert.checkRequired(form) && Alert.checkEmail(form.querySelector('input[name=email]'))) {
                    let data = {};
                    Array.prototype.forEach.call(form.elements, (el) => {
                        if (el.value) {
                            if (el.type == "radio" && el.checked) {
                                data[el.name] = el.value;
                            } else if (el.type == "date") {
                                let date = new Date(el.value);
                                data[el.name] = date;
                            } else if (el.value && el.type !== "radio") {
                                data[el.name] = el.value;
                            }
                        }
                    });


                    let id = form.getAttribute("data-id");

                    UserRequest.addUser(id, data, () => {
                        UserList.setListContent(id);
                    });
                    this.closeModal();
            }
        }
    });
}