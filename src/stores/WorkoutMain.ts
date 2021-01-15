import {action, makeObservable, observable} from "mobx";

export default class WorkoutMain {
    @observable
    wdate: Date

    @observable
    finished: boolean

    @observable
    weight?: string = undefined

    @action
    setFinished(finished: boolean) {
        this.finished = finished
    }

    @action
    setWeight(weight: string) {
        this.weight = weight
    }

    constructor(wdate: Date, finished: boolean, weight?: string) {
        this.wdate = wdate
        this.finished = finished
        this.weight = weight
        makeObservable(this);
    }
}