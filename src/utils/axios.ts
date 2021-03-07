import axios from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: 'http://localhost:8080/api/v1/admin'
})

http.interceptors.request.use(config => {
  if (sessionStorage.token) {
    config.headers.Authorization = `Bearer ${sessionStorage.token}`
  }
  return config
}, err => {
})

http.interceptors.response.use(res => {
  return res
}, err => {
  if (err.response?.data?.message) {
    ElMessage.error(err.response.data.message)
  }
  if (err.response?.status === 401) {
    router.push('/login')
  }
})

export default http