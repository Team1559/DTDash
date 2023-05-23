export class DashboardSource {
    static Editor = 'Layout Editor'
    static Robot = 'Robot'
    static Uploaded = 'Uploaded'
    static BrowserStorage = 'Browser Storage'
}

export class DashboardSpec {
    static DefaultName = "Layout Editor"
    constructor(nCols) {
        this.columns = []
        this.name = DashboardSpec.DefaultName
        this.source = DashboardSource.Editor

        for (let i = 0; i < nCols; i++) {
            this.columns.push([])
        }
    }
}
