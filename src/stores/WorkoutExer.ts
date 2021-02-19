import {action, makeObservable, observable} from "mobx";
import Wset from "./Wset";
import ApiHelper from "./ApiHelper";

export default class WorkoutExer {
    apiHelper: ApiHelper

    id?: number

    prevId?: number

    curPrevId?: number

    @observable
    name: string

    @observable
    wsets: Wset[] = []

    @observable
    prevWsets: Wset[][] = []

    @observable
    editableId: number = -1

    constructor(id: number | undefined, name: string, prevId: number | undefined, apiHelper: ApiHelper) {
        this.apiHelper = apiHelper
        this.id = id
        this.prevId = prevId
        this.curPrevId = prevId
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
        this.prevWsets = [wsets]
    }

    @action
    setWsets(wsets: Wset[]) {
        this.wsets = wsets
    }

    @action
    setEditableId(id: number) {
        this.editableId = id
    }

    @action.bound
    loadMorePrev() {
        if (this.curPrevId != undefined) {
            this.apiHelper.workoutExerApi?.getWSetsAndPrevIdUsingGET(this.curPrevId!!).then(
                (wsetsId) => {
                    this.addPrevWsets(wsetsId.wsets, wsetsId.prevId)
                }
            )
        }
    }

    @action
    addPrevWsets(wsets: Wset[], prevId?: number) {
        if (prevId != undefined) {
            this.prevWsets.unshift(wsets)
        }
        this.curPrevId = prevId
    }

    update(setPrev: boolean = true) {
        if (this.id != undefined) {
            this.apiHelper.workoutExerApi?.getWsetsUsingGET(this.id).then(
                (wsets) => this.setWsets(wsets.map(wset => new Wset(wset.weight, wset.count, wset.id)))
            );
        }
        if (setPrev && this.prevId != undefined) {
            this.apiHelper.workoutExerApi?.getWsetsUsingGET(this.prevId).then(
                (wsets) => this.setPrevWsets(wsets.map(wset => new Wset(wset.weight, wset.count, wset.id)))
            );
        }
    }


    addWset(weight: string, count: string, callback = () => {}) {
        const promise = (this.editableId == -1) ?
        this.apiHelper.wsetApi!!.createWsetUsingPOST({weight: weight, count: count, id: -1}, this.id!!) :
            this.apiHelper.wsetApi!!.editWsetUsingPUT({weight: weight, count: count, id: this.editableId})
        promise.then( () => {
            this.setEditableId(-1)
            this.update(false);
            callback()
        } )
    }
}