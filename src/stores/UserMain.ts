import {makeObservable, observable} from "mobx";

export default class UserMain {
    @observable
    name: string

    constructor(name: string) {
        this.name = name
        makeObservable(this);
    }
}