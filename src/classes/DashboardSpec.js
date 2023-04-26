import Size from './Size.js'

export default class DashboardSpec {
    constructor() {
        this.panels = []
        this.blockSize = new Size(150, 40)
    }
    addPanel(panel) {
        this.panels.push(panel)
    }
    removePanel(panel) {
        const index = this.panels.indexOf(panel)
        if (index !== -1) {
            this.panels.splice(index)
        }
    }
}
