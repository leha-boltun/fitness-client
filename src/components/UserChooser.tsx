import {observer} from "mobx-react";
import * as React from "react";
import AppStore from "stores/AppStore";
import {Link, RouteComponentProps} from "react-router-dom";

interface IUserChooser {
    appStore: AppStore
}

@observer
export default class UserChooser extends React.Component<IUserChooser & RouteComponentProps, {}> {
    componentDidMount() {
        this.props.appStore.usersStore.fetchUsers()
    }

    render() {
        return (
            <main>
                <h1>Выберите пользователя</h1>
                {
                    this.props.appStore.usersStore.userNames.map(
                        (user, idx) => (
                            <div key={idx}>
                                <Link to={"/user/" + user.id}>{user.name}</Link>
                            </div>
                        )
                    )
                }
            </main>
        )
    }
}