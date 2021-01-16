import {action, makeObservable, observable} from "mobx";

export default class WorkoutMain {
    @observable
    wuserId: number

    @observable
    wdate: Date

    @observable
    finished: boolean

    @observable
    weight?: string = undefined

    @observable
    totalTime?: string = undefined

    @action
    setFinished(finished: boolean) {
        this.finished = finished
    }

    @action
    setWeight(weight: string) {
        this.weight = weight
    }

    @action
    setTotalTime(totalTime: string) {
        this.totalTime = totalTime
    }

    constructor(wuserId: number, wdate: Date, finished: boolean, weight?: string, totalTime?: string) {
        this.wuserId = wuserId
        this.wdate = wdate
        this.finished = finished
        this.weight = weight
        this.totalTime = totalTime
        makeObservable(this);
    }
}