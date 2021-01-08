import UsersStore from "stores/UsersStore";

export default class AppStore {
    usersStore: UsersStore

    constructor() {
        this.usersStore = new UsersStore()
    }
}