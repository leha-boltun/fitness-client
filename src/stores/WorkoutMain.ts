import {action, computed, makeObservable, observable} from "mobx";

export default class WorkoutMain {
    @observable
    wuserId: number

    @observable
    wdate: Date

    @observable
    finished: boolean

    @observable
    weight?: string = undefined

    @observable
    totalTime?: string = undefined

    @observable
    private readonly _weightDiff?: string = undefined

    @observable
    private readonly _weightDiffSame?: string = undefined

    // noinspection JSMethodCanBeStatic
    private formatDiff(num?: string): string {
        if (num !== undefined && num !== null) {
            if (parseFloat(num) > 0) {
                return "+" + num
            } else {
                return num
            }
        } else {
            return "+?"
        }
    }

    @computed
    get weightDiff(): string {
        return this.formatDiff(this._weightDiff)
    }

    @computed
    get weightDiffSame(): string {
        return this.formatDiff(this._weightDiffSame)
    }

    @action
    setFinished(finished: boolean) {
        this.finished = finished
    }

    @action
    setTotalTime(totalTime: string) {
        this.totalTime = totalTime
    }

    constructor(wuserId: number, wdate: Date, finished: boolean, weight?: string,
                totalTime?: string, weightDiff?: string, weightDiffSame?: string) {
        this.wuserId = wuserId
        this.wdate = wdate
        this.finished = finished
        this.weight = weight
        this.totalTime = totalTime
        this._weightDiff = weightDiff;
        this._weightDiffSame = weightDiffSame;
        makeObservable(this);
    }
}