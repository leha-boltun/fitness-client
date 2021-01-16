import {makeObservable, observable} from "mobx";

export default class Workout {
    id: number
    @observable
    wdate: Date

    @observable
    progName: string

    @observable
    finished: boolean

    @observable
    totalTime?: string = undefined

    constructor(id: number, wdate: Date, finished: boolean, progName: string, totalTime?: string) {
        this.id = id
        this.wdate = wdate
        this.finished = finished
        this.progName = progName
        this.totalTime = totalTime
        makeObservable(this)
    }
}