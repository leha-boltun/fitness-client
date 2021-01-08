import * as React from "react";
import {observer} from "mobx-react";
import UserStore from "stores/UserStore";

@observer
export default class UserName extends React.Component<{ user: UserStore }, {}> {
    render() {
        return (
            <div>
                { this.props.user.name }
            </div>
        )
    }
}