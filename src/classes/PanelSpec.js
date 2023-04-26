import Size from './Size.js'
import VisType from './VisType.js'

export default class PanelSpec {
    static nextId = 1

    constructor(topics) {
        this.topics = topics || []
        this.visType = VisType.Text
        this.colors = ['red']
        this.x = 0
        this.y = 0
        this.w = 3
        this.h = 6
        this.id = PanelSpec.nextId
        PanelSpec.nextId++
    }
}
