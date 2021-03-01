import {action, computed, makeObservable, observable} from "mobx";
import ApiHelper from "./ApiHelper";
import moment from "moment";
import WorkoutMain from "./WorkoutMain";
import TimeStamp from "./TimeStamp";
import WorkoutExer from "./WorkoutExer";
import {DNextEvent} from "../services/api";

export default class WorkoutStore {
    @observable
    main?: WorkoutMain = undefined

    @observable
    next?: string = undefined

    @observable
    canAddWsets: boolean = false

    @observable
    canSetWeight: boolean = false

    @observable
    timeStamps?: TimeStamp[] = undefined

    @observable
    workoutExers?: WorkoutExer[] = undefined

    @observable
    canUndo: boolean = false

    @observable
    id: number = -1

    @observable
    editingWeight?: boolean = false

    maxUndoSeconds?: number

    undoTimeout?: number

    private apiHelper: ApiHelper;

    constructor(apiHelper: ApiHelper) {
        this.apiHelper = apiHelper
        makeObservable(this)
    }

    @action
    setEditingWeight(editing: boolean) {
        this.editingWeight = editing
    }

    private reloadMain() {
        this.apiHelper.workoutApi?.getMainUsingGET1(this.id).then((main) => {
            this.setMain(new WorkoutMain(
                main.wuserId,
                moment(main.wdate).toDate(),
                main.finished, main.weight, main.totalTime, main.weightDiff, main.weightDiffSame
            ));
        })
    }

    @action
    setWeight(weight: string) {
        return this.apiHelper.workoutApi!!.editWeightUsingPATCH(this.id, weight).then(() => {
            this.reloadMain()
            this.setEditingWeight(false)
        })
    }

    @computed
    get isInit() {
        return this.id != -1
    }

    @action
    reset() {
        this.id = -1
        this.editingWeight = false
        clearTimeout(this.undoTimeout)
    }

    @action
    setExers(exers: WorkoutExer[]) {
        this.workoutExers = exers
    }

    @action
    setId(id: number) {
        this.id = id
    }

    @action
    setMain(main: WorkoutMain) {
        this.main = main
    }

    @action.bound
    disableUndo() {
        this.canUndo = false
    }

    @action
    setTimeStamps(timestamps: TimeStamp[]) {
        this.timeStamps = timestamps
        clearTimeout(this.undoTimeout)
        if (this.timeStamps.length != 0 && moment(this.main!!.wdate).isSame(moment(), 'day')) {
            const seconds = moment().diff(moment(this.timeStamps[0].time, 'HH:mm:ss'), 'seconds')
            if (seconds < this.maxUndoSeconds!!) {
                this.canUndo = true
                this.undoTimeout = window.setTimeout(this.disableUndo, (this.maxUndoSeconds!! - seconds) * 1000)
            } else {
                this.canUndo = false
            }
        } else {
            this.canUndo = false
        }
    }

    @action
    setNext(next: string, canAddWsets: boolean, canSetWeight: boolean) {
        this.next = next
        this.canAddWsets = canAddWsets
        this.canSetWeight = canSetWeight
    }

    init(id: number) {
        Promise.all([
            this.apiHelper.workoutApi?.getMainUsingGET1(id).then((main) => {
                this.setMain(new WorkoutMain(
                    main.wuserId,
                    moment(main.wdate).toDate(),
                    main.finished, main.weight, main.totalTime, main.weightDiff, main.weightDiffSame
                ));
                if (!this.main!!.finished) {
                    this.apiHelper.workoutApi!!.getNextEventNameUsingGET(id).then((next) => {
                        this.setNext(next.name, next.canAddWsets, next.canSetWeight)
                    })
                }
            }), this.apiHelper.workoutApi!!.getMaxUndoSecondsUsingGET().then(
                (num) => {
                    this.maxUndoSeconds = num
                    return this.apiHelper.workoutApi!!.getTimestampsUsingGET(id)
                }
            ).then((timeStamps) => {
                this.setTimeStamps(timeStamps.map((t) => new TimeStamp(t.time, t.type,
                    t.timeDiff ? moment(t.timeDiff, "HH:mm:ss").format("HH:mm:ss") : "")))
            }), this.apiHelper.workoutApi?.getExersUsingGET(id).then( (exers) => {
                this.setExers(exers.map(exer => new WorkoutExer(exer.id, exer.name, exer.prevId, this.apiHelper)))
            })
        ]).then(() => {
            this.setId(id)
        })
    }

    private processNext(next: DNextEvent) {
        this.setNext(next.name, next.canAddWsets, next.canSetWeight)
        this.apiHelper.workoutApi!!.getTimestampsUsingGET(this.id).then((timeStamps) => {
            this.setTimeStamps(timeStamps.map((t) => new TimeStamp(t.time, t.type, t.timeDiff || "")))
        })
    }

    @action.bound
    doNext(weight: string = "") {
        this.setEditingWeight(false)
        const promise = (this.canSetWeight) ? this.apiHelper.workoutApi!!.processNextEventSetWeightUsingPOST(this.id, weight) :
            this.apiHelper.workoutApi!!.processNextEventUsingPOST(this.id)
        promise.then((next) => {
            if (this.canSetWeight) {
                // Update weight
                this.reloadMain()
            }
            if (next.name == "") {
                this.main!!.setFinished(true)
                this.apiHelper.workoutApi?.getTotalTimeUsingGET(this.id).then(
                    (totalTime) => this.main!!.setTotalTime(totalTime)
                );
            }
            this.processNext(next)
        })
    }

    @action.bound
    undoCurrent() {
        this.setEditingWeight(false)
        this.apiHelper.workoutApi?.undoEventUsingDELETE(this.id).then( (next) => {
            if (this.main!!.finished) {
                this.main!!.setTotalTime(undefined)
            }
            this.reloadMain()
            this.processNext(next)
        })
    }
}