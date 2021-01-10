import UserName from "./UserName";
import {action, makeObservable, observable} from "mobx";
import ApiHelper from "./ApiHelper";

export default class UsersStore {
    @observable
    userNames: UserName[] = []
    private apiHelper: ApiHelper

    constructor(apiHelper: ApiHelper) {
        this.apiHelper = apiHelper
        makeObservable(this)
    }

    fetchUsers() {
        this.apiHelper.usersApi!!.getUsersUsingGET().then(
            (resp) => {
                this.setUsers(resp.map((user) => {
                    return new UserName(user.id, user.name)
                }))
            }
        )
    }

    @action
    setUsers(users: UserName[]) {
        this.userNames = users
    }
}