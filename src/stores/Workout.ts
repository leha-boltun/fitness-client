import {makeObservable, observable} from "mobx";

export default class Workout {
    id: number
    @observable
    wdate: Date

    constructor(id: number, wdate: Date) {
        this.id = id
        this.wdate = wdate
        makeObservable(this)
    }
}