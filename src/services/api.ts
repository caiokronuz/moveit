import axios from 'axios';

const api = axios.create({
    baseURL: 'https://moveitapi.herokuapp.com/'
})

export default api;