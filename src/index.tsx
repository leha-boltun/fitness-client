import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppStore from "stores/AppStore";
import UserChooser from "components/UserChooser";
import "reset.css"

const appState = new AppStore();
ReactDOM.render(<UserChooser appState={appState}/>, document.getElementById('root'));
