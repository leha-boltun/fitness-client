import {makeObservable, observable} from "mobx";

export default class TimeStamp {
    @observable
    time: string

    @observable
    name: string

    constructor(time: string, name: string) {
        this.time = time
        this.name = name;
        makeObservable(this);
    }
}