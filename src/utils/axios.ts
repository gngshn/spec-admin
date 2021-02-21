import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:8080/api/v1/admin'
})

export default http