import {action, computed, makeObservable, observable} from "mobx";
import ApiHelper from "./ApiHelper";
import moment from "moment";
import WorkoutMain from "./WorkoutMain";
import TimeStamp from "./TimeStamp";
import WorkoutExer from "./WorkoutExer";

export default class WorkoutStore {
    @observable
    main?: WorkoutMain = undefined

    @observable
    next?: string = undefined

    @observable
    timeStamps?: TimeStamp[] = undefined

    @observable
    workoutExers?: WorkoutExer[] = undefined

    @observable
    private id: number = -1
    private apiHelper: ApiHelper;

    constructor(apiHelper: ApiHelper) {
        this.apiHelper = apiHelper
        makeObservable(this)
    }

    @computed
    get isInit() {
        return this.id != -1
    }

    @action
    reset() {
        this.id = -1
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

    @action
    setTimeStamps(timestamps: TimeStamp[]) {
        this.timeStamps = timestamps
    }

    @action
    setNextName(next: string) {
        this.next = next
    }

    init(id: number) {
        Promise.all([
            this.apiHelper.workoutApi?.getMainUsingGET1(id).then((main) => {
                this.setMain(new WorkoutMain(moment(main.wdate).toDate(), main.finished));
                if (!this.main!!.finished) {
                    this.apiHelper.workoutApi!!.getNextEventNameUsingGET(id).then((next) => {
                        this.setNextName(next.name)
                    })
                }
            }), this.apiHelper.workoutApi!!.getTimestampsUsingGET(id).then((timeStamps) => {
                this.setTimeStamps(timeStamps.map((t) => new TimeStamp(t.time, t.type)))
            }), this.apiHelper.workoutApi?.getExersUsingGET(id).then( (exers) => {
                this.setExers(exers.map(exer => new WorkoutExer(exer.id, exer.name, this.apiHelper)))
            })
        ]).then(() => {
            this.setId(id)
        })
    }

    @action.bound
    doNext() {
        this.apiHelper.workoutApi!!.processNextEventUsingPOST(this.id).then((next) => {
            if (next.name == "") {
                this.main!!.setFinished(true)
            }
            this.setNextName(next.name)
            this.apiHelper.workoutApi!!.getTimestampsUsingGET(this.id).then((timeStamps) => {
                this.setTimeStamps(timeStamps.map((t) => new TimeStamp(t.time, t.type)))
            })
        })
    }
}