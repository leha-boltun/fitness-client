import {makeObservable, observable} from "mobx";

export default class Wset {
    @observable
    weight: string
    @observable
    count: string

    constructor(weight: string, count: string) {
        this.weight = weight;
        this.count = count;
        makeObservable(this);
    }
}