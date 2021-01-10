import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppStore from "stores/AppStore";
import UserChooser from "components/UserChooser";
import {BrowserRouter} from "react-router-dom";
import PrivateRoute from "components/PrivateRoute";
import "reset.css"
import style from "./style.styl";
import UserDisp from 'components/UserDisp';

const appStore = new AppStore();
ReactDOM.render(
    <BrowserRouter>
        <div className={style.main}>
            <PrivateRoute appStore={appStore} exact path='/user/:id' component={(props: any) =>
                <UserDisp id={props.match.params.id} appStore={appStore}/>
            }/>
            <PrivateRoute appStore={appStore} exact path='/' component={(props: any) =>
                <UserChooser appStore={appStore} {...props}/>
            }/>
        </div>
    </BrowserRouter>,
    document.getElementById('root')
);
