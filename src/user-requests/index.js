export default class UserRequest {
    constructor() {}

    static addUser(id, data, callback) {
        let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        let xhr = new XHR();

        xhr.open('POST', 'http://test-api.javascript.ru/v1/' + id + "/users", true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.send(JSON.stringify(data));

        if (callback) {
            xhr.onloadend = () => {
                callback(xhr.responseText);
            }
        }
    }

    static getUser(id, user, callback) {
        let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        let xhr = new XHR();

        xhr.open('GET', 'http://test-api.javascript.ru/v1/' + id + "/users/" + user, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.send();

        if (callback) {
            xhr.onloadend = () => {
                callback(xhr.responseText);
            }
        }
    }

    static getUsers(id, callback) {
        let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        let xhr = new XHR();

        xhr.open('GET', 'http://test-api.javascript.ru/v1/' + id + "/users?delay=100", true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.send();

        if (callback) {
            xhr.onloadend = () => {
                callback(xhr.responseText);
            }
        }
    }

    static updateUser(id, user, data, callback) {
        let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        let xhr = new XHR();

        xhr.open('PATCH', 'http://test-api.javascript.ru/v1/' + id + "/users/" + user, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.send(JSON.stringify(data));

        if (callback) {
            xhr.onloadend = () => {
                callback(xhr.responseText);
            }
        }
    }

    static deleteUser(id, user, callback) {
        let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        let xhr = new XHR();

        xhr.open('DELETE', 'http://test-api.javascript.ru/v1/' + id + "/users/" + user, true);

        xhr.send();

        if (callback) {
            xhr.onloadend = callback;
        }
    }
}