import Size from './Size.js'
import VisType from './VisType.js'

export default class PanelSpec {
    static nextId = 1

    constructor(topics) {
        this.topics = topics || []
        this.visType = VisType.Text
        this.size = new Size(2, 2)
        this.position = null
        this.colors = ['red']
        this.id = PanelSpec.nextId
        PanelSpec.nextId++
    }
}
