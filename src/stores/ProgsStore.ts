import Prog from "./Prog";
import {action, makeObservable, observable} from "mobx";
import ApiHelper from "./ApiHelper";

export default class ProgsStore {
    @observable
    progs?: Prog[] = []

    private apiHelper: ApiHelper

    constructor(apiHelper: ApiHelper) {
        this.apiHelper = apiHelper
        makeObservable(this);
    }

    fetchProgs() {
        this.apiHelper.progsApi?.getProgsUsingGET().then((progs) => {
            this.setProgs(progs.map(prog => new Prog(prog.id, prog.name)))
        })
    }

    @action
    setProgs(progs: Prog[]) {
        this.progs = progs;
    }
}