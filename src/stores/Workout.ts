import {makeObservable, observable} from "mobx";

export default class Workout {
    id: number
    @observable
    wdate: Date

    @observable
    progName: string

    @observable
    finished: boolean

    constructor(id: number, wdate: Date, finished: boolean, progName: string) {
        this.id = id
        this.wdate = wdate
        this.finished = finished
        this.progName = progName
        makeObservable(this)
    }
}