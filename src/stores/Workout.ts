import {makeObservable, observable} from "mobx";

export default class Workout {
    id: number
    @observable
    wdate: Date

    @observable
    finished: boolean

    constructor(id: number, wdate: Date, finished: boolean) {
        this.id = id
        this.wdate = wdate
        this.finished = finished
        makeObservable(this)
    }
}