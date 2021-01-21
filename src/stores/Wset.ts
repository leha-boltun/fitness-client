import {makeObservable, observable} from "mobx";

export default class Wset {
    id: number
    @observable
    weight: string
    @observable
    count: string

    constructor(weight: string, count: string, id: number) {
        this.weight = weight
        this.count = count
        this.id = id
        makeObservable(this)
    }
}