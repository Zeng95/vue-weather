import axios from 'axios'

const httpClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default httpClient
