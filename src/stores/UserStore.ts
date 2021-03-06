import Workout from "./Workout";
import {action, computed, makeObservable, observable} from "mobx";
import ApiHelper from "./ApiHelper";
import UserMain from "./UserMain";
import moment from "moment";
import Prog from "./Prog";

export default class UserStore {
    @observable
    main?: UserMain = undefined

    @observable
    workouts?: Workout[] = undefined

    @observable
    progs?: Prog[] = undefined

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
    setMain(main: UserMain) {
        this.main = main
    }

    @action
    setWorkouts(workouts: Workout[]) {
        this.workouts = workouts
    }

    @action
    reset() {
        this.id = -1
    }

    @action
    setId(id: number) {
        this.id = id
    }

    @action
    setProgs(progs: Prog[]) {
        this.progs = progs;
    }

    @action
    doAddWorkout(workout: Workout) {
        this.workouts!!.push(workout)
    }

    init(id: number) {
        return Promise.all([this.apiHelper.userApi!!.getMainUsingGET(id).then( (main) => {
            this.setMain(new UserMain(main.name));
        }),
        this.apiHelper.userApi!!.getProgsUsingGET1(id).then((progs) => {
            this.setProgs(progs.map(prog => new Prog(prog.id, prog.name)))
        }),
        this.apiHelper.userApi!!.getWorkoutsUsingGET(id).then((workouts) => {
            this.setWorkouts(workouts.map( (w) =>
                new Workout(w.id, moment(w.wdate, false).toDate(), w.finished, w.programName, w.totalTime) ))
        })]).then(() => {this.setId(id)})
    }

    @action.bound
    addWorkout(progId: number, prevProgId: number, onAdd: (workout: Workout) => any) {
        this.apiHelper.workoutApi!!.createUsingPOST(prevProgId, progId, this.id)
            .then( (w) =>
                onAdd(new Workout(w.id, moment(w.wdate, false).toDate(), w.finished, w.programName, w.totalTime)) )
    }
}