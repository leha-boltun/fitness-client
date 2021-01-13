import {observer} from "mobx-react";
import React from "react";
import {RouteComponentProps} from "react-router-dom";
import AppStore from "../stores/AppStore";
import moment from "moment";
import {ErrorMessage, Field, Form, Formik} from "formik";
import style from 'style.styl'

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
                            workoutStore.workoutExers!!.map((workoutExer, exerIdx) => (
                                <div key={exerIdx}>
                                    <div>{workoutExer.name}</div>
                                    <Formik
                                        initialValues={{weight: '', count: ''}}
                                        validate={values => {
                                            const errors: any = {};
                                            if (values.weight === '') {
                                                errors.weight = '!';
                                            }
                                            if (values.count === '') {
                                                errors.count = "!"
                                            }
                                            return errors;
                                        }}
                                        onSubmit={(values, {setSubmitting, resetForm}) => {
                                            workoutExer.addWset(values.weight, values.count, () => {
                                                setSubmitting(false)
                                                resetForm()
                                            })
                                        }}
                                    >
                                        <Form>
                                            <table className={style.weightTable}>
                                                <tbody>
                                                <tr>
                                                    {
                                                        workoutExer.wsets.map((wset, idx) => (
                                                            <td key={idx}>{wset.weight}</td>
                                                        ))
                                                    }
                                                    <td className={style.specTd} >
                                                        <Field autoComplete="off"
                                                               className={style.weight} type="weight" name="weight"
                                                               placeholder="Вес"/>
                                                        <ErrorMessage name="weight" component="span"/>
                                                    </td>
                                                    <td  className={style.specTd}  rowSpan={2}>
                                                        <button type="submit">
                                                            +
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    {
                                                        workoutExer.wsets.map((wset, idx) => (
                                                            <td key={idx}>{wset.count}</td>
                                                        ))
                                                    }
                                                    <td className={style.specTd}>
                                                        <Field autoComplete="off" className={style.count} type="count" name="count"
                                                               placeholder="Число"/>
                                                        <ErrorMessage name="count" component="span"/>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </Form>
                                    </Formik>
                                </div>
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