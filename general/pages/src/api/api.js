import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;

const worker = axios.create({
  baseURL: 'https://workers.kevinrmaillet314.workers.dev',
});

export const addPost = (newPost) => {
  return worker
    .post('/posts', newPost, { withCredentials: true })
    .then((res) => res.data.data)
    .catch((error) => error.response);
};

export const fetchPosts = () => {
  return worker
    .get('/posts', { withCredentials: true })
    .then((res) => res.data.data)
    .catch((error) => error.response);
};
