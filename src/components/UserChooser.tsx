import {observer} from "mobx-react";
import * as React from "react";
import AppStore from "stores/AppStore";
import style from 'style.styl'
import UserName from "./UserName";

@observer
export default class UserChooser extends React.Component<{ appStore: AppStore }, {}> {
    componentDidMount() {
        this.props.appStore.usersStore.fetchUsers()
    }

    render() {
        return (
            <main className={style.main}>
                {
                    this.props.appStore.usersStore.users.map(
                        (user, idx) => (
                            <UserName key={idx} user={user}/>
                        )
                    )
                }
            </main>
        )
    }
}