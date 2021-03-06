import {observer} from "mobx-react";
import React from "react";
import {Link, RouteComponentProps} from "react-router-dom";
import AppStore from "../stores/AppStore";
import moment from "moment";
import {ErrorMessage, Field, Form, Formik} from "formik";
import style from 'style.styl'
import 'long-press-event'
import Swipe from "react-easy-swipe";
import WorkoutExer from "../stores/WorkoutExer";

interface IWorkoutDisp {
    id: number
    appStore: AppStore
}

class TdInputWeight extends React.Component<{ canAddWsets: boolean, innerRef: any }, any> {
    render() {
        return (
            <td>
                {(this.props.canAddWsets &&
                    <div className={style.specTd}>
                        <Field autoComplete="off" innerRef={this.props.innerRef}
                               className={style.weight} type="weight" name="weight"
                               placeholder="Вес"/>
                        <ErrorMessage name="weight" component="span"/>&nbsp;
                        <button type="submit">
                            +
                        </button>
                    </div>
                )}
            </td>
        )
    }
}

class TdInputCount extends React.Component<{ canAddWsets: boolean, onClose: (() => void) | null }, any> {
    render() {
        return (
            <td>
                {(this.props.canAddWsets &&
                    <div className={style.specTd}>
                        <Field autoComplete="off" className={style.count}
                               type="count" name="count"
                               placeholder="Число"/>
                        <ErrorMessage name="count" component="span"/>&nbsp;
                        {
                            this.props.onClose && <button onClick={this.props.onClose}>
                            x
                            </button>
                        }
                    </div>
                )}
            </td>
        )
    }
}

@observer
class SwipeableTable extends React.Component<{ workoutExer: WorkoutExer }> {
    private swipeDiv ?: HTMLDivElement = undefined
    private fillerDiv ?: HTMLDivElement = undefined
    private lastItem ?: HTMLDivElement = undefined
    private scrollLeft: number = -1

    setStart = () => {
        this.scrollLeft = this.swipeDiv!!.scrollLeft
    }

    swipeRight = () => {
        const workoutExer = this.props.workoutExer
        if (this.scrollLeft < 10) {
            workoutExer.loadMorePrev()
        }
    }

    setSwipeDiv = (swipeDiv: HTMLDivElement) => {
        this.swipeDiv = swipeDiv
        this.trySetWidth()
    }

    setLastItem = (lastItem: HTMLDivElement) => {
        this.lastItem = lastItem
        this.trySetWidth()
    }

    trySetWidth() {
        if (this.fillerDiv && this.lastItem && this.swipeDiv) {
            this.fillerDiv.style.width = (this.swipeDiv.parentNode!! as HTMLDivElement).offsetWidth -
                this.lastItem.offsetWidth - 10 /*margin*/ + 'px'
        }
    }

    setWidth = (fillerDiv: HTMLDivElement) => {
        this.fillerDiv = fillerDiv
        this.trySetWidth()
    }

    render() {
        const workoutExer = this.props.workoutExer
        return (<Swipe
            allowMouseEvents={true}
            tolerance={60}
            onSwipeStart={this.setStart}
            innerRef={() => {}}
            onSwipeRight={this.swipeRight}>
            <div
                ref={this.setSwipeDiv}
                className={style.scrollWrap}>
                {workoutExer.prevWsetsArr.map((wsetGroup, groupIdx) => (
                    <div key={groupIdx} ref={(el) => {
                        if (el != null && groupIdx === workoutExer.prevWsetsArr.length - 1) {
                            this.setLastItem(el)
                        }
                    }} className={style.prevWeightWrap}>
                        <span className={style.prevWsetDate}>{wsetGroup.date}</span>
                        {wsetGroup.wsets.length != 0 ? <table className={style.weightTable}>
                            <tbody>
                            <tr>
                                {
                                    wsetGroup.wsets.map((wset, idx) => (
                                        <td key={idx}>{wset.weight}</td>
                                    ))
                                }
                            </tr>
                            <tr>
                                {
                                    wsetGroup.wsets.map((wset, idx) => (
                                        <td key={idx}>{wset.count}</td>
                                    ))
                                }
                            </tr>
                            </tbody>
                        </table> : <div className={style.blankWeight}>—</div>}
                    </div>
                ))}
                <div ref={this.setWidth} className={style.scrollFiller}/>
            </div>
        </Swipe>)
    }
}

@observer
export default class WorkoutDisp extends React.Component<IWorkoutDisp & RouteComponentProps> {
    firstFields = [] as HTMLInputElement[]
    weightForms = [] as any[]

    componentDidMount() {
        this.props.appStore.workoutStore.init(this.props.id)
    }

    doNext = () => {
        this.props.appStore.workoutStore.doNext()
    }

    doClose = (idx: number) => {
        this.props.appStore.workoutStore.workoutExers!![idx].setEditableId(-1)
        this.weightForms[idx].resetForm()
    }

    doCloseWeight = () => {
        this.props.appStore.workoutStore.editingWeight = false
    }

    render() {
        const workoutStore = this.props.appStore.workoutStore
        return (
            <div>
                {
                    workoutStore.isInit &&
                    <main>
                        <h1>Тренировка {moment(workoutStore.main!!.wdate).format("DD.MM.YYYY")}</h1>
                        <div><Link to={"/user/" + workoutStore.main!!.wuserId}>Другие тренировки</Link></div>
                        <div>{
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
                                            <Form className={style.weightForm}>
                                                <Field autoComplete="off"
                                                       className={style.weight} type="weight" name="weight"
                                                       placeholder="Вес"/>
                                                <button type={"submit"}>{workoutStore.next!!}</button>
                                                <ErrorMessage name="weight" component="div"/>
                                            </Form>
                                        </Formik> :
                                        <button onClick={this.doNext}>{workoutStore.next!!}</button>
                                ) : <span>Тренировка завершена, время {workoutStore.main!!.totalTime}</span>
                        }
                        {workoutStore.canUndo && <button className={style.undoBtn} onClick={workoutStore.undoCurrent}>Отменить</button>}
                        </div>
                        {
                            workoutStore.editingWeight ?
                                (
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
                                            this.props.appStore.workoutStore.setWeight(values.weight.replace(',', '.'))
                                        }
                                    }>
                                        <Form className={style.weightForm}>
                                            <Field autoComplete="off"
                                                   className={style.weight} type="weight" name="weight"
                                                   placeholder="Вес"/>
                                            <button type={"submit"}>ОК</button>
                                            <button onClick={this.doCloseWeight}>Отмена</button>
                                            <ErrorMessage name="weight" component="div"/>
                                        </Form>
                                    </Formik>
                                ) :
                                (workoutStore.main!!.weight && <div ref={
                                    elem => elem && elem!!
                                        .addEventListener('long-press', () => {
                                            this.props.appStore.workoutStore.setEditingWeight(true)
                                        })
                                } data-long-press-delay="300">Вес {workoutStore.main!!.weight} кг.
                                    (<span>{workoutStore.main!!.weightDiff} кг</span>,&nbsp;
                                    <span>{workoutStore.main!!.weightDiffSame} кг</span>)</div>)
                        }
                        {
                            workoutStore.workoutExers!!.map((workoutExer, exerIdx) => (
                                <div key={exerIdx}>
                                    <div>{workoutExer.name}</div>

                                    {workoutExer.hasPrev &&
                                    <SwipeableTable workoutExer={workoutExer}/>
                                    }
                                    {workoutExer.hasCur && <Formik
                                        innerRef={(el: any) => {this.weightForms[exerIdx] = el}}
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
                                                this.firstFields[exerIdx]!!.focus()
                                            })
                                        }}
                                    >
                                        <Form className={style.scrollWrap}>
                                            <table className={style.weightTable}>
                                                <tbody>
                                                <tr>
                                                    {
                                                        workoutExer.wsets.map((wset, idx) => (
                                                            (wset.id === workoutExer.editableId) ?
                                                            <TdInputWeight key={idx}
                                                                           canAddWsets={workoutStore.canAddWsets} innerRef={
                                                                (el: HTMLInputElement) => this.firstFields[exerIdx] = el
                                                            }/> :
                                                            <td ref={
                                                                elem => elem && elem!!
                                                                    .addEventListener('long-press', () => {
                                                                        workoutStore.canAddWsets &&
                                                                        workoutExer.setEditableId(wset.id)
                                                                    })
                                                            } data-long-press-delay="300" key={idx}>{wset.weight}</td>
                                                        ))
                                                    }
                                                    {
                                                        workoutExer.editableId == -1 && workoutStore.canAddWsets &&
                                                        <TdInputWeight canAddWsets={workoutStore.canAddWsets} innerRef={
                                                            (el: HTMLInputElement) => this.firstFields[exerIdx] = el
                                                        }/>
                                                    }
                                                </tr>
                                                <tr>
                                                    {
                                                        workoutExer.wsets.map((wset, idx) => (
                                                            (wset.id === workoutExer.editableId) ?
                                                            <TdInputCount key={idx} canAddWsets={workoutStore.canAddWsets}
                                                                          onClose={this.doClose.bind(this, exerIdx)}/> :
                                                            <td ref={
                                                                elem => elem && elem!!
                                                                    .addEventListener('long-press', () => {
                                                                        workoutStore.canAddWsets &&
                                                                        workoutExer.setEditableId(wset.id)
                                                                    })
                                                            } data-long-press-delay="300" key={idx}>{wset.count}</td>
                                                        ))
                                                    }
                                                    {
                                                        workoutExer.editableId == -1 && workoutStore.canAddWsets &&
                                                        <TdInputCount canAddWsets={workoutStore.canAddWsets} onClose={null}/>
                                                    }
                                                </tr>
                                                </tbody>
                                            </table>
                                        </Form>
                                    </Formik>}
                                </div>
                            ))
                        }
                        {
                            workoutStore.timeStamps!!.map((timeStamp, idx) =>
                                <div
                                    key={idx}>{timeStamp.name} - {timeStamp.time} {timeStamp.timeDiff !== "" && "(" + timeStamp.timeDiff + ")"}</div>
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