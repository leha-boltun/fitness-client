import {action, makeObservable, observable} from "mobx";
import Wset from "./Wset";
import ApiHelper from "./ApiHelper";
import PrevWsets from "./PrevWsets";
import moment from "moment";

export default class WorkoutExer {
    apiHelper: ApiHelper

    id?: number

    hasPrev: boolean

    curPrevId?: number

    @observable
    name: string

    @observable
    wsets: Wset[] = []

    @observable
    prevWsetsArr: PrevWsets[] = []

    @observable
    editableId: number = -1

    constructor(id: number | undefined, name: string, prevId: number | undefined, apiHelper: ApiHelper) {
        this.apiHelper = apiHelper
        this.id = id
        this.hasPrev = prevId != undefined
        this.curPrevId = id
        this.name = name
        makeObservable(this)
        this.update()
    }

    get hasCur() {
        return this.id != undefined
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
            this.apiHelper.workoutExerApi?.getWSetsPrevUsingGET(this.curPrevId!!).then(
                (wsetsId) => {
                    this.addPrevWsets(wsetsId.wsets, wsetsId.prevId, wsetsId.date)
                }
            )
        }
    }

    @action
    addPrevWsets(wsets: Wset[], prevId?: number, date?: string) {
        if (prevId != undefined) {
            this.prevWsetsArr.unshift(new PrevWsets(wsets, moment(date).format("DD.MM")))
        }
        this.curPrevId = prevId
    }

    update(setPrev: boolean = true) {
        if (this.id != undefined) {
            this.apiHelper.workoutExerApi?.getWsetsUsingGET(this.id).then(
                (wsets) => this.setWsets(wsets.map(wset => new Wset(wset.weight, wset.count, wset.id)))
            );
        }
        if (setPrev && this.hasPrev) {
            this.loadMorePrev()
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