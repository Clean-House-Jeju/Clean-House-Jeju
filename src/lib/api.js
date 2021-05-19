import axios from 'axios';

const API_ROOT = 'https://raw.githubusercontent.com/Woongstar/data_repo/main/cleanhouseproject/getcleanhouseData/cleandata.json';

export const getData = () => {
    return axios.get(API_ROOT);
}
