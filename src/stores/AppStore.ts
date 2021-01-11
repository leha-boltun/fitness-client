import UsersStore from "stores/UsersStore";
import {AuthStore} from "stores/AuthStore";
import ApiHelper from "./ApiHelper";
import UserStore from "./UserStore";
import WorkoutStore from "./WorkoutStore";

export default class AppStore {
    usersStore: UsersStore
    authStore: AuthStore
    userStore: UserStore
    workoutStore: WorkoutStore

    constructor() {
        const apiHelper = new ApiHelper()
        this.usersStore = new UsersStore(apiHelper)
        this.authStore = new AuthStore(apiHelper)
        this.userStore = new UserStore(apiHelper)
        this.workoutStore = new WorkoutStore(apiHelper);
    }
}