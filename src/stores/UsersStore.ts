import User from "./User";
import {action, makeObservable, observable} from "mobx";
import ApiHelper from "./ApiHelper";

export default class UsersStore {
    @observable
    users: User[] = []
    private apiHelper: ApiHelper

    constructor(apiHelper: ApiHelper) {
        this.apiHelper = apiHelper
        makeObservable(this)
    }

    fetchUsers() {
        this.apiHelper.usersApi!!.getUsersUsingGET().then(
            (resp) => {
                this.setUsers(resp.map((user) => {
                    return new User(user.id, user.name)
                }))
            }
        )
    }

    @action
    setUsers(users: User[]) {
        this.users = users
    }
}