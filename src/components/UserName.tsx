import * as React from "react";
import {observer} from "mobx-react";
import User from "stores/User";

@observer
export default class UserName extends React.Component<{ user: User }, {}> {
    render() {
        return (
            <div>
                { this.props.user.name }
            </div>
        )
    }
}