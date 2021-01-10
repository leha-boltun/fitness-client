import {observer} from "mobx-react";
import React from "react";
import AppStore from "stores/AppStore";
import moment from "moment";

@observer
export default class UserDisp extends React.Component<{id: number, appStore: AppStore}>{
    componentDidMount() {
        this.props.appStore.userStore.init(this.props.id)
    }

    render() {
        const userStore = this.props.appStore.userStore
        return (
            userStore.isInit &&
            <main>
                <h1>{userStore.main!!.name}</h1>
                {
                    userStore.workouts!!.map(
                        (workout, idx) =>
                            ( <div key={idx}>Тренировка {moment(workout.wdate).format("DD.MM.YYYY")}</div> )
                    )
                }
            </main>
        )
    }

    componentWillUnmount() {
        this.props.appStore.userStore.reset()
    }
}