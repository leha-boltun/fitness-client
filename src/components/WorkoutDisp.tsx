import {observer} from "mobx-react";
import React from "react";
import {RouteComponentProps} from "react-router-dom";

interface IWorkoutDisp {
    id: number
}

@observer
export default class WorkoutDisp extends React.Component<IWorkoutDisp & RouteComponentProps>{
    render() {
        return (
            <div>
                <h1>Тренировка</h1>
            </div>
        )
    }
}