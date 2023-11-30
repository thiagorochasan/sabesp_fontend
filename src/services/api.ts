import axios, {AxiosError} from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'


export function setupAPIClient(){

    let cookies = parseCookies();

    const api = axios.create({
        baseURL: 'https://sabesp-backend-rho.vercel.app'
    })


    return api;
}