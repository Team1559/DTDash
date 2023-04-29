import VisType from './VisType.js'
import { topicDisplayString, commonPrefix, trimPrefix } from '@/classes/Format.js'

export default class PanelSpec {
    static nextId = 1

    constructor(topics) {
        this.title = ""
        this.labels = []
        this.setTopics(topics || [])
        this.visType = VisType.Text
        this.colors = ['red']
        this.column = 0
        this.id = PanelSpec.nextId
        PanelSpec.nextId++
    }
    setTopics(topics) {
        this.topics = topics
        let labels = topics.map(topicDisplayString)

        this.title = commonPrefix(labels)
        this.labels = labels.map(label =>
            trimPrefix(label, this.title + "/")
        )
    }
}
