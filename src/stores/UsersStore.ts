import UserStore from "./UserStore";
import {action, makeObservable, observable} from "mobx";
import {Configuration, UsersControllerApi} from "services/api";
import HOST from 'host'

export default class UsersStore {
    @observable
    users: UserStore[] = []

    constructor() {
        makeObservable(this)
        new UsersControllerApi(new Configuration(), HOST).getUsersUsingGET().then(
            (resp) => {
                this.setUsers(resp.map((user) => {
                    return new UserStore(user.id, user.name)
                }))
            }
        )
    }

    @action
    setUsers(users: UserStore[]) {
        this.users = users
    }
}