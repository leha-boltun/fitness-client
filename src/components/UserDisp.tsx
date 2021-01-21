import {observer} from "mobx-react";
import React, {ChangeEvent} from "react";
import AppStore from "stores/AppStore";
import moment from "moment";
import {Link, RouteComponentProps} from "react-router-dom";
import Workout from "../stores/Workout";
import {IReactionDisposer, reaction} from "mobx";

interface IUserDisp {
    id: number,
    appStore: AppStore
}

@observer
export default class UserDisp extends React.Component<IUserDisp & RouteComponentProps> {
    readonly state = {curProgId: -1, prevProgId: -1}

    private setIdDisp?: IReactionDisposer

    componentDidMount() {
        this.props.appStore.progsStore.fetchProgs();
        this.setIdDisp = reaction(() => this.props.appStore.progsStore.progs, (progs) => {
            this.state.prevProgId = this.state.curProgId = progs!![0].id
        })
        this.props.appStore.userStore.init(this.props.id)
    }

    addWorkout = () => {
        this.props.appStore.userStore.addWorkout(this.state.curProgId, this.state.prevProgId, (workout) => {
            this.props.history.push("/workout/" + workout.id)
        })
    }

    openWorkout = (workout: Workout) => {
        this.props.history.push("/workout/" + workout.id)
    }

    onProgSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = +e.target!!.value!!
        this.setState({prevProgId: value, curProgId: value});
    }

    onPrevProgSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = +e.target!!.value!!
        this.setState({prevProgId: value});
    }

    render() {
        const userStore = this.props.appStore.userStore
        return (
            userStore.isInit &&
            <main>
                <h1>{userStore.main!!.name}</h1>
                <Link to="/">Все пользователи</Link>
                <div>
                    <div>
                        <select onChange={this.onProgSelect} value={this.state.curProgId}>
                            {
                                this.props.appStore.progsStore.progs!!.map(
                                    (prog, idx) =>
                                        <option key={idx} value={prog.id}>{prog.name}</option>
                                )
                            }
                        </select>
                        <select onChange={this.onPrevProgSelect} value={this.state.prevProgId}>
                            {
                                this.props.appStore.progsStore.progs!!.map(
                                    (prog, idx) =>
                                        <option key={idx} value={prog.id}>{prog.name}</option>
                                )
                            }
                            <option data-id={-1} key={-1} value={-1}>Нет</option>
                        </select>
                        <button onClick={this.addWorkout}>Новая тренировка</button>
                    </div>
                    {
                        userStore.workouts!!.map(
                            (workout, idx) =>
                                (
                                    <div key={idx} onClick={
                                        this.openWorkout.bind(this, workout)
                                    }>Тренировка {
                                        moment(workout.wdate).format("DD.MM.YYYY")} {" "}
                                        {workout.progName} {workout.finished && " - Завершена"}
                                        {workout.totalTime && " " + workout.totalTime}
                                    </div>
                                )
                        )
                    }
                </div>
            </main>
        )
    }

    componentWillUnmount() {
        this.props.appStore.userStore.reset()
        this.setIdDisp && this.setIdDisp()
    }
}