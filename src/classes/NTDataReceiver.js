import { TopicTree } from '@/classes/TopicTree.js'
import { NT4_Client } from "@/nt4/nt4.js"

export class NTDataReceiver {
  static instance

  constructor(hostname, keyPrefix, retention) {
    this.keyPrefix = keyPrefix
    this.retention = retention
    this.topicsByName = new Map()
    this.topicTree = new TopicTree("")
    this.dataByTopic = new Map()
    this.connected = false
    this.topicTreeChangeHandlers = []
    this.connectionStateHandlers = []
    this.startTimeStamp = null
    this.pruneInterval = 3000

    this.ntClient = new NT4_Client(
      hostname,
      this.topicAnnounceHandler.bind(this),
      this.topicUnannounceHandler.bind(this),
      this.valueUpdateHandler.bind(this),
      this.onConnect.bind(this),
      this.onDisconnect.bind(this),
    )
    this.ntClient.subscribeTopicNames([keyPrefix])
    NTDataReceiver.instance = this

    setTimeout(this.prune.bind(this), this.pruneInterval)
  }
  prune() {
    const oldestTimestamp = Date.now() - this.retention
    for (let seriesName of this.dataByTopic.keys()) {
      const series = this.dataByTopic.get(seriesName)
      const firstIndex = this.getIndexAfterTimestamp(series, oldestTimestamp)
      if (firstIndex > 0) {
        series.splice(0, firstIndex)
        // console.log("Pruned " + seriesName + " at index " + firstIndex + " leaving " + series.length + " entries.")
      }
    }
    setTimeout(this.prune.bind(this), this.pruneInterval)
  }
  topicAnnounceHandler(topic) {
    const name = topic.name
    if (!this.isTopicWanted(name)) {
      return
    }
    this.addTopic(topic)
    this.ntClient.subscribePeriodic([name], 0.1)
  }
  topicUnannounceHandler(topic) {
    const name = topic.name
    console.log("remove: ", name)
    this.topicTree.remove(name)
  }
  valueUpdateHandler(topic, timestamp_us, value) {
    if (!this.startTimeStamp) {
      this.startTimeStamp = Date.now() - timestamp_us / 1000.0
    }
    const name = topic.name
    if (!this.isTopicWanted(name)) {
      return
    }
    if (!this.topicsByName.get(name)) {
      this.addTopic(topic)
    }
    var queue = this.dataByTopic.get(name)
    // store data in object format so chart.js doesn't have to parse
    queue.push({ x: this.startTimeStamp + timestamp_us / 1000.0, y: value })
  }
  handleConnectionStateChanged(handler) {
    handler(this.connected)
    this.connectionStateHandlers.push(handler)
  }
  onConnect() {
    this.connected = true
    this.connectionStateHandlers.forEach(f => f(this.connected))
  }
  onDisconnect() {
    this.connected = false
    this.connectionStateHandlers.forEach(f => f(this.connected))
  }
  isConnected() {
    return this.connected
  }
  isTopicWanted(name) {
    return name.startsWith(this.keyPrefix)
  }
  addTopic(topic) {
    const name = topic.name
    this.dataByTopic.set(name, [])
    this.topicsByName.set(name, topic)
    this.topicTree.add(name)
    this.topicTree.sort()
    this.topicTreeChangeHandlers.forEach(f => f(this.topicTree))
  }
  getIndexAfterTimestamp(data, ts) {
    let low = 0
    let high = data.length - 1

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const midTime = data[mid].x

      if (midTime < ts)
        low = mid + 1
      else if (midTime > ts)
        high = mid - 1
      else
        return mid + 1 // element after the one we want
    }
    return low
  }
  getDataForTopic(name) {
    return this.dataByTopic.get(name)
  }
  getDataSince(name, since) {
    const data = this.dataByTopic.get(name)
    const startIndex = this.getIndexAfterTimestamp(data, since)
    if (startIndex >= data.length) {
      return []
    }
    return data.slice(startIndex)
  }
  handleTopicTreeChanged(handler) {
    handler(this.topicTree)
    this.topicTreeChangeHandlers.push(handler)
  }
}
