import React from "react";
import {Route} from "react-router-dom";
import {observer} from "mobx-react";
import PasswordPrompt from "./PasswordPrompt";


export default observer(({component, appStore, ...rest}: any) => {
    const auth = appStore.authStore.auth
    const isReady = appStore.authStore.isReady
    appStore.authStore.checkCookies(() => {})
    const routeComponent = (props: any) => {
        if (isReady) {
            if (auth) {
                return React.createElement(component, props)
            } else {
                return <PasswordPrompt appStore={appStore} redirUrl={props.location.search} {...props}/>
            }
        }
    }
    return <Route {...rest} render={routeComponent}/>;
})