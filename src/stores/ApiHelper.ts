import {Configuration, PingApi, UsersControllerApi} from "services/api";
import HOST from "host";

export default class ApiHelper {
    pingApi?: PingApi
    usersApi?: UsersControllerApi

    createPing(login: string, password: string) {
        return new PingApi(new Configuration({username: login, password: password}), HOST)
    }

    createAll(login: string, password: string) {
        const config = new Configuration({username: login, password: password})
        this.pingApi = new PingApi(config, HOST)
        this.usersApi = new UsersControllerApi(config, HOST)
    }
}