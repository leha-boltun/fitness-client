export default class UserStore {
    name: string
    id: number
    constructor(id: number, name: string) {
        this.name = name
        this.id = id
    }
}