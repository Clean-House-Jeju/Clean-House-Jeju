import axios from 'axios';

const API_ROOT = "https://gist.githubusercontent.com/Yummy-sk/162dd1e4349ebf821f43db6c3c67f744/raw/ed25686c4f36e2b1474a8eeab2fa52837bdb5d93/jeju_clean_house";

export const getData = () => {
    return axios.get(API_ROOT);
}
