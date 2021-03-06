import {makeObservable, observable} from "mobx";

export default class Prog {
    id: number

    @observable
    name: string

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        makeObservable(this);
    }
}