import {action, computed, makeObservable, observable} from "mobx";
import ApiHelper from "./ApiHelper";
import Cookies from 'universal-cookie';
import moment from "moment";

export enum AuthState {
    OK,
    FAIL,
    CHECKING,
    UNKNOWN,
    NO_COOKIES,
}

export class AuthStore {
    @observable
    authState: AuthState = AuthState.UNKNOWN

    private apiHelper: ApiHelper

    constructor(apiHelper: ApiHelper) {
        makeObservable(this);
        this.apiHelper = apiHelper;
    }

    checkCookies(callback: (isOk: boolean) => void) {
        const cookies = new Cookies()
        if (typeof cookies.get("login") != 'undefined' && typeof cookies.get("password") != undefined) {
            this.doCheckAuth(cookies.get("login"), cookies.get("password"), callback)
        } else {
            this.setAuthState(AuthState.NO_COOKIES)
        }
    }
    @computed
    get isReady() {
        return this.authState != AuthState.UNKNOWN
    }

    @computed
    get auth() {
        return this.authState == AuthState.OK
    }

    @action
    setAuthState(newState: AuthState) {
        this.authState = newState;
    }

    checkAuth(login: string, password: string, callback: (isOk: boolean) => void) {
        this.setAuthState(AuthState.CHECKING)
        this.doCheckAuth(login, password, callback)
    }

    private doCheckAuth(login: string, password: string, callback: (isOk: boolean) => void) {
        this.apiHelper.createPing(login, password).pingUsingGET().then(() => {
            this.apiHelper.createAll(login, password)
            const cookies = new Cookies()
            const opts = {path: "/", expires: moment().add(1, 'M').toDate()}
            cookies.set("login", login, opts)
            cookies.set("password", password, opts)
            callback(true);
            this.setAuthState(AuthState.OK)
        }, () => {
            callback(false);
            this.setAuthState(AuthState.FAIL)
        })
    }
}