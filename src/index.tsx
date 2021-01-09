import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppStore from "stores/AppStore";
import UserChooser from "components/UserChooser";
import {BrowserRouter, Route} from "react-router-dom";
import PrivateRoute from "components/PrivateRoute";
import "reset.css"
import PasswordPrompt from "./components/PasswordPrompt";
import style from "./style.styl";

const appStore = new AppStore();
ReactDOM.render(
    <BrowserRouter>
        <div className={style.main}>
            <PrivateRoute appStore={appStore} exact path='/' component={() =>
                <UserChooser appStore={appStore}/>
            }/>
            <Route exact path='/login' component={(props: any) =>
                <PasswordPrompt appStore={appStore} {...props}/>
            }/>
        </div>
    </BrowserRouter>,
    document.getElementById('root')
);
