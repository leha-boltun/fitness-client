import {action, makeObservable, observable} from "mobx";
import Wset from "./Wset";
import ApiHelper from "./ApiHelper";

export default class WorkoutExer {
    apiHelper: ApiHelper

    id: number

    @observable
    name: string

    @observable
    wsets: Wset[] = []

    constructor(id: number, name: string, apiHelper: ApiHelper) {
        this.apiHelper = apiHelper
        this.id = id
        this.name = name
        makeObservable(this)
        this.update()
    }

    @action
    setWsets(wsets: Wset[]) {
        this.wsets = wsets
    }

    update() {
        this.apiHelper.workoutExerApi?.getWsetsUsingGET(this.id).then(
            (wsets) => this.setWsets(wsets.map(wset => new Wset(wset.weight, wset.count)))
        );
    }

    addWset(weight: string, count: string, callback = () => {}) {
        this.apiHelper.wsetApi?.createWsetUsingPOST({weight: weight, count: count}, this.id).then( () => {
            this.update();
            callback()
        } )
    }
}