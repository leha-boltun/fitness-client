import {makeObservable, observable} from "mobx";
import Wset from "./Wset";

export default class PrevWsets {
    @observable
    wsets: Wset[]
    @observable
    date?: string = undefined

    constructor(wsets: Wset[], date?: string) {
        this.wsets = wsets;
        this.date = date;
        makeObservable(this);
    }
}