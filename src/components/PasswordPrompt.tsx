import {observer} from "mobx-react";
import * as React from "react";
import AppStore from "stores/AppStore";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {AuthState} from "stores/AuthStore";
import {RouteComponentProps} from "react-router-dom";

interface IPasswordPrompt {
    appStore: AppStore
}

@observer
export default class PasswordPrompt extends React.Component<IPasswordPrompt & RouteComponentProps> {
    componentDidMount() {
        this.props.appStore.authStore.checkCookies((isOk) => {
            if (isOk) {
                this.props.history.replace("/")
            }
        })
    }

    render() {
        const authStore = this.props.appStore.authStore
        return (
            authStore.authState != AuthState.UNKNOWN &&
            <main>
                <h1>Авторизация</h1>
                <Formik
                    initialValues={{login: '', password: ''}}
                    validate={values => {
                        const errors: any = {};
                        if (!values.login) {
                            errors.login = 'Обязательное поле';
                        }
                        if (!values.password) {
                            errors.password = "Обязательное поле"
                        }
                        return errors;
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        authStore.checkAuth(values.login, values.password, (isOk) => {
                            setSubmitting(false)
                            if (isOk) {
                                this.props.history.replace("/")
                            }
                        })
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <div>
                                <Field type="login" name="login" placeholder="Введите логин"/>
                            </div>
                            <ErrorMessage name="login" component="div"/>
                            <div>
                                <Field type="password" name="password" placeholder="Введите пароль"/>
                            </div>
                            <ErrorMessage name="password" component="div"/>
                            <button type="submit" disabled={isSubmitting}>
                                Вход
                            </button>
                            <div>
                                {authStore.authState == AuthState.CHECKING && "Выполняется вход..."}
                            </div>
                            <div>
                                {authStore.authState == AuthState.FAIL && "Ошибка"}
                            </div>
                        </Form>
                    )}
                </Formik>
            </main>
        )
    }
}