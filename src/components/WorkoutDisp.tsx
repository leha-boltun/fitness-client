import {observer} from "mobx-react";
import React from "react";
import {RouteComponentProps} from "react-router-dom";
import AppStore from "../stores/AppStore";
import moment from "moment";

interface IWorkoutDisp {
    id: number
    appStore: AppStore
}

@observer
export default class WorkoutDisp extends React.Component<IWorkoutDisp & RouteComponentProps> {
    componentDidMount() {
        this.props.appStore.workoutStore.init(this.props.id)
    }

    render() {
        const workoutStore = this.props.appStore.workoutStore
        return (
            <div>
                {
                    workoutStore.isInit &&
                    <main>
                        <h1>Тренировка {moment(workoutStore.main!!.wdate).format("DD.MM.YYYY")}</h1>
                        {
                            !workoutStore.main!!.finished ?
                                <button onClick={workoutStore.doNext}>{workoutStore.next!!}</button>
                                : <div>Тренировка завершена</div>
                        }
                        {
                            workoutStore.workoutExers!!.map((workoutExer, idx) => (
                                <div key={idx}>{workoutExer.name}</div>
                            ))
                        }
                        {
                            workoutStore.timeStamps!!.map((timeStamp, idx) =>
                                <div key={idx}>{timeStamp.name} - {timeStamp.time}</div>
                            )
                        }
                    </main>
                }
            </div>
        )
    }

    componentWillUnmount() {
        this.props.appStore.workoutStore.reset()
    }
}