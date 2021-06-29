import axios from 'axios'
import FormData from 'form-data'
import bunyan from 'bunyan'

import config from './config.js'


const login = (apikey) => {
    return new Promise((resolve, reject) => {
        const url = config.API_LOGIN
        const form = new FormData()
        form.append('request-json', JSON.stringify({ 'apikey': apikey }))

        axios.post(url, form, { baseURL: config.BASE_URL, headers: form.getHeaders() })
            .then((response) => {
                const status = response.data.status
                const session = response.data.session
                
                if (status === config.STATUS_SUCCESS && typeof session !== 'undefined') {
                    resolve(response.data)
                } else {
                    reject(response.data)
                }
            })
            .catch((error) => {
                const response = {
                    status: config.STATUS_ERROR
                }
                if (error.response) {
                    response.errormessage = `http ${error.response.status} error`
                } else if (error.request) {
                    response.errormessage = `request ${error.request._currentUrl} failed`
                } else {
                    esponse.errormessage = error.message
                }
                reject(response)
            })
    });
}

export default login

// try {
//     const response = await login(config.API_KEY)
//     console.log(response)
// } catch (e) {
//     console.log(e)
// }
