import {action, makeObservable, observable} from "mobx";

export default class WorkoutMain {
    @observable
    wdate: Date

    @observable
    finished: boolean

    @action
    setFinished(finished: boolean) {
        this.finished = finished
    }

    constructor(wdate: Date, finished: boolean) {
        this.wdate = wdate
        this.finished = finished
        makeObservable(this);
    }
}