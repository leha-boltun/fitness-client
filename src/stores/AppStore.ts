import UsersStore from "stores/UsersStore";
import {AuthStore} from "stores/AuthStore";
import ApiHelper from "./ApiHelper";

export default class AppStore {
    usersStore: UsersStore
    authStore: AuthStore

    constructor() {
        const apiHelper = new ApiHelper()
        this.usersStore = new UsersStore(apiHelper)
        this.authStore = new AuthStore(apiHelper)
    }
}