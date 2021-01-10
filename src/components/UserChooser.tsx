import {observer} from "mobx-react";
import * as React from "react";
import AppStore from "stores/AppStore";
import {RouteComponentProps} from "react-router-dom";
import UserName from "stores/UserName";

interface IUserChooser {
    appStore: AppStore
}

@observer
export default class UserChooser extends React.Component<IUserChooser & RouteComponentProps, {}> {
    componentDidMount() {
        this.props.appStore.usersStore.fetchUsers()
    }

    userClick = (user: UserName) => {
        this.props.history.push("/user/" + user.id)
    }

    render() {
        return (
            <main>
                <h1>Выберите пользователя</h1>
                {
                    this.props.appStore.usersStore.userNames.map(
                        (user, idx) => (
                            <div key={idx} onClick={this.userClick.bind(this, user)}>{user.name}</div>
                        )
                    )
                }
            </main>
        )
    }
}