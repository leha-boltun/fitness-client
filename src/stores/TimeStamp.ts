import {makeObservable, observable} from "mobx";

export default class TimeStamp {
    @observable
    time: string

    @observable
    name: string

    @observable
    timeDiff: string = ""

    constructor(time: string, name: string, timeDiff: string) {
        this.time = time
        this.name = name;
        this.timeDiff = timeDiff;
        makeObservable(this);
    }
}