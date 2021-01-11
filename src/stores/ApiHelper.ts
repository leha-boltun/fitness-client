import {Configuration, PingApi, UserControllerApi, UsersControllerApi, WorkoutControllerApi} from "services/api";
import HOST from "host";

export default class ApiHelper {
    pingApi?: PingApi
    usersApi?: UsersControllerApi
    userApi?: UserControllerApi
    workoutApi?: WorkoutControllerApi

    createPing(login: string, password: string) {
        return new PingApi(new Configuration({username: login, password: password}), HOST)
    }

    createAll(login: string, password: string) {
        const config = new Configuration({username: login, password: password})
        this.pingApi = new PingApi(config, HOST)
        this.usersApi = new UsersControllerApi(config, HOST)
        this.userApi = new UserControllerApi(config, HOST)
        this.workoutApi = new WorkoutControllerApi(config, HOST)
    }
}