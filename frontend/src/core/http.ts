import axios from "axios";

export class AxiosInterceptor {
    private static baseURL: string | undefined = process.env.REACT_APP_BACKEND ;
    public static $timeHost = axios.create({
        baseURL: AxiosInterceptor.baseURL
    })
    public static $host = axios.create({
        baseURL: AxiosInterceptor.baseURL
    })
    constructor() {
        AxiosInterceptor.$timeHost.interceptors.request.use(config => {
            config.headers.autorization = `sessionStartedTimestamp ${localStorage.getItem('sessionStartedTimestamp')}`
            return config;
        });

    }
}
new AxiosInterceptor();
// TODO: BIND SESSION TO TIME