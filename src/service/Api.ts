import axios from "axios";
const host = process.env.VUE_APP_HOST;
const SERVER_API =
  process.env.VUE_APP_SERVER_API ||
  (host && `http://${host}:3000`) ||
  "http://localhost:3000";
console.log(process.env);
export default () =>
  axios.create({
    baseURL: SERVER_API
  });
