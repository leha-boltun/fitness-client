import React from "react";
import {Redirect, Route} from "react-router-dom";
import {observer} from "mobx-react";


export default observer(({component, appStore, ...rest}: any) => {
    const auth = appStore.authStore.auth
    const routeComponent = (props: any) => {
        return auth
            ? React.createElement(component, props)
            : <Redirect to={{pathname: '/login'}}/>
    }
    return <Route {...rest} render={routeComponent}/>;
})