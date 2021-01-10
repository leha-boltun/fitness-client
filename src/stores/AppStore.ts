import UsersStore from "stores/UsersStore";
import {AuthStore} from "stores/AuthStore";
import ApiHelper from "./ApiHelper";
import UserStore from "./UserStore";

export default class AppStore {
    usersStore: UsersStore
    authStore: AuthStore
    userStore: UserStore;

    constructor() {
        const apiHelper = new ApiHelper()
        this.usersStore = new UsersStore(apiHelper)
        this.authStore = new AuthStore(apiHelper)
        this.userStore = new UserStore(apiHelper);
    }
}