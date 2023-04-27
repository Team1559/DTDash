import Size from './Size.js'

export default class DashboardSpec {
    constructor(nCols) {
        this.columns = []
        for (var i = 0; i < nCols; i++) {
            this.columns.push([])
        }
        this.blockSize = new Size(150, 40)
    }
    addPanel(panel, col) {
        this.columns[col].push(panel)
    }
    removePanel(panel) {
        for (var column of this.columns) {
            const index = column.indexOf(panel)
            if (index !== -1) {
                column.splice(index)
                return
            }
        }
    }
}
