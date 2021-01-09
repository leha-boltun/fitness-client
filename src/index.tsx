import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppStore from "stores/AppStore";
import UserChooser from "components/UserChooser";
import {BrowserRouter, Route} from "react-router-dom";
import PrivateRoute from "components/PrivateRoute";
import "reset.css"
import PasswordPrompt from "./components/PasswordPrompt";

const appStore = new AppStore();
ReactDOM.render(
    <BrowserRouter>
        <PrivateRoute appStore={appStore} exact path='/' component={ () =>
            <UserChooser appStore={appStore}/>
        }/>
        <Route exact path='/login' component={ (props: any) =>
            <PasswordPrompt appStore={appStore} {...props}/>
        }/>
    </BrowserRouter>,
    document.getElementById('root')
);
