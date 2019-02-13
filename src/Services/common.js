import config from '../config';
import axios from 'axios';

class HttpClient {
    constructor() {
        this.baseUrl = config.baseUrl;
    }

    _handleError(error, reject) {
        debugger;
        const code = error.response.status;
        if (code === 401) {
            window.location = './login.html';
        } else if (code === 400) {
            reject(error.response.data.message);
        } else if (code === 404) {
            window.location = './404.html';
        } else {
            window.location = './500.html';
        }
    }

    _getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    get(url, params = {}) {
        return new Promise((resolve) => {
            axios.get(`${this.baseUrl}/${url}`, {
                params: params,
                headers: this._getHeaders()
            }).then(resolve)
                .catch(this._handleError);
        });
    }
    post(url, data) {
        debugger;
        return new Promise((resolve, reject) => {
            axios.post(`${this.baseUrl}/${url}`, data,
                {
                    headers: this._getHeaders()
                }).then(resolve)
                .catch((error) => {
                    this._handleError(error, reject)
                });
        })
    }
}

const httpClient = new HttpClient();
export default httpClient;