import axios, {Method} from "axios";

export const executeRequest = (endpoint: string, method : Method, body? : any) => {
    const headers = { 'Content-Type' : 'application/json'} as any;

    // verificar se tem o token salvo no storage e se tiver add no headers

    const URL = 'http://localhost:3000/api/' + endpoint;
    console.log(`executando: ${URL}, metodo: ${method} e body: ${body}`);
    return axios.request({
        url : URL,
        method,
        data: body? body : '',
        headers,
        timeout: 30000
    });
}