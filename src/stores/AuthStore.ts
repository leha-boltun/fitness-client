import {action, computed, makeObservable, observable} from "mobx";
import ApiHelper from "./ApiHelper";
import Cookies from 'universal-cookie';

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
            this.setAuthState(AuthState.OK)
            this.apiHelper.createAll(login, password)
            const cookies = new Cookies()
            cookies.set("login", login)
            cookies.set("password", password)
            callback(true);
        }, () => {
            this.setAuthState(AuthState.FAIL)
            callback(false);
        })
    }
}