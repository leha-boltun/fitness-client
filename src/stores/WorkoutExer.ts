import {action, makeObservable, observable} from "mobx";
import Wset from "./Wset";
import ApiHelper from "./ApiHelper";

export default class WorkoutExer {
    apiHelper: ApiHelper

    id?: number

    prevId?: number

    @observable
    name: string

    @observable
    wsets: Wset[] = []

    @observable
    prevWsets: Wset[] = []

    constructor(id: number | undefined, name: string, prevId: number | undefined, apiHelper: ApiHelper) {
        this.apiHelper = apiHelper
        this.id = id
        this.prevId = prevId
        this.name = name
        makeObservable(this)
        this.update()
    }

    hasCur() {
        return this.id != undefined
    }

    hasPrev() {
        return this.prevId != undefined
    }

    @action
    setPrevWsets(wsets: Wset[]) {
        this.prevWsets = wsets
    }

    @action
    setWsets(wsets: Wset[]) {
        this.wsets = wsets
    }

    update() {
        if (this.id != undefined) {
            this.apiHelper.workoutExerApi?.getWsetsUsingGET(this.id).then(
                (wsets) => this.setWsets(wsets.map(wset => new Wset(wset.weight, wset.count)))
            );
        }
        if (this.prevId != undefined) {
            this.apiHelper.workoutExerApi?.getWsetsUsingGET(this.prevId).then(
                (wsets) => this.setPrevWsets(wsets.map(wset => new Wset(wset.weight, wset.count)))
            );
        }
    }


    addWset(weight: string, count: string, callback = () => {}) {
        this.apiHelper.wsetApi?.createWsetUsingPOST({weight: weight, count: count}, this.id!!).then( () => {
            this.update();
            callback()
        } )
    }
}