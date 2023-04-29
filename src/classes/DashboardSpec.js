export class DashboardSource {
    static Editor = 'Layout Editor'
    static Robot = 'Robot'
    static Uploaded = 'Uploaded'
    static SavedInBrowser = 'Saved in Browser'
}

export class DashboardSpec {
    constructor(nCols) {
        this.columns = []
        this.name = "Layout Editor"
        this.source = DashboardSource.Editor

        for (let i = 0; i < nCols; i++) {
            this.columns.push([])
        }
    }
}
