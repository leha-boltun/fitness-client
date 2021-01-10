import {observer} from "mobx-react";
import React from "react";
import AppStore from "stores/AppStore";
import moment from "moment";
import {RouteComponentProps} from "react-router-dom";

interface IUserDisp {
    id: number,
    appStore: AppStore
}

@observer
export default class UserDisp extends React.Component<IUserDisp & RouteComponentProps> {
    componentDidMount() {
        this.props.appStore.userStore.init(this.props.id)
    }

    addWorkout = () => {
        this.props.appStore.userStore.addWorkout((workout) => {
            this.props.history.push("/workout/" + workout.id)
        })
    }

    render() {
        const userStore = this.props.appStore.userStore
        return (
            userStore.isInit &&
            <main>
                <h1>{userStore.main!!.name}</h1>
                <div>
                    <button onClick={this.addWorkout}>Новая тренировка</button>
                    {
                        userStore.workouts!!.map(
                            (workout, idx) =>
                                (<div key={idx}>Тренировка {moment(workout.wdate).format("DD.MM.YYYY")}</div>)
                        )
                    }
                </div>
            </main>
        )
    }

    componentWillUnmount() {
        this.props.appStore.userStore.reset()
    }
}