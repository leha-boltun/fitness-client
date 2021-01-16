import {observer} from "mobx-react";
import React from "react";
import {Link, RouteComponentProps} from "react-router-dom";
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

    doNext = () => {
        this.props.appStore.workoutStore.doNext()
    }

    render() {
        const workoutStore = this.props.appStore.workoutStore
        return (
            <div>
                {
                    workoutStore.isInit &&
                    <main>
                        <h1>Тренировка {moment(workoutStore.main!!.wdate).format("DD.MM.YYYY")}</h1>
                        <Link to={"/user/" + workoutStore.main!!.wuserId}>Другие тренировки</Link>
                        {
                            !workoutStore.main!!.finished ?
                                (
                                    workoutStore.canSetWeight ?
                                        <Formik initialValues={{weight: ""}} validate={
                                            (values) => {
                                                const errors: any = {};
                                                if (!/^\d{1,3}(?:[.,]\d+)?$/.test(values.weight)) {
                                                    errors.weight = "Вес должен быть числом"
                                                }
                                                return errors
                                            }
                                        } onSubmit={
                                            (values) => {
                                                this.props.appStore.workoutStore.doNext(values.weight.replace(',', '.'))
                                            }
                                        }>
                                            <Form>
                                                <Field autoComplete="off"
                                                       className={style.weight} type="weight" name="weight"
                                                       placeholder="Вес"/>
                                                <button type={"submit"}>{workoutStore.next!!}</button>
                                                <ErrorMessage name="weight" component="div"/>
                                            </Form>
                                        </Formik> :
                                    <button onClick={this.doNext}>{workoutStore.next!!}</button>
                                )
                                : <div>Тренировка завершена, время {workoutStore.main!!.totalTime}</div>
                        }
                        {
                            workoutStore.main!!.weight &&
                                <div>Вес {workoutStore.main!!.weight} кг.</div>
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
                                                    {(workoutStore.canAddWsets &&
                                                        <td className={style.specTd}>
                                                            <Field autoComplete="off"
                                                                   className={style.weight} type="weight" name="weight"
                                                                   placeholder="Вес"/>
                                                            <ErrorMessage name="weight" component="span"/>
                                                        </td>
                                                    )}
                                                    {(workoutStore.canAddWsets &&
                                                        <td className={style.specTd} rowSpan={2}>
                                                            <button type="submit">
                                                                +
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                                <tr>
                                                    {
                                                        workoutExer.wsets.map((wset, idx) => (
                                                            <td key={idx}>{wset.count}</td>
                                                        ))
                                                    }
                                                    {(workoutStore.canAddWsets &&
                                                        <td className={style.specTd}>
                                                            <Field autoComplete="off" className={style.count}
                                                                   type="count" name="count"
                                                                   placeholder="Число"/>
                                                            <ErrorMessage name="count" component="span"/>
                                                        </td>
                                                    )}
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
                                <div key={idx}>{timeStamp.name} - {timeStamp.time} {timeStamp.timeDiff !== "" && "(" + timeStamp.timeDiff + ")"}</div>
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