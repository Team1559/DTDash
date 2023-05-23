<template>
  <div>
    <canvas
      width="width"
      ref="chart"
    >
    </canvas>
  </div>
</template>

<script setup>
import { Chart } from 'chart.js'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { NTDataReceiver, getIndexAfterTimestamp } from '../classes/NTDataReceiver.js'
import { topicDisplayString, commonPrefix, trimPrefix } from '@/classes/Format.js'

Chart.defaults.color = '#eee'
</script>

<script>
export default {
  // This is a weird Vue component. Normally, Vue components re-render
  // to create new (virtual) DOM when props or data change. In this
  // case, the DOM remains unchanged, containing only a canvas.
  // Component state is reflected in the embedded Chart object. We don't
  // want to destroy and recreate that all the time because it will
  // flicker.
  name: 'Scatter',
  props: {
    topics: Array,
    width: String,
    height: String,
  },
  mounted() {
    this.destroyChart()
    this.createChart()
    setInterval(this.onRefresh, 200)
  },
  updated() {
    this.destroyChart()
    this.createChart()
  },
  beforeUnmount() {
    this.destroyChart()
  },
  data: () => ({
    chart: null,
    lastUpdateByTopic: new Map(),
    colors: scaleOrdinal(schemeCategory10),
  }),
  computed: {
  },
  methods: {
    destroyChart() {
      if (this.chart !== null) {
        this.chart.destroy()
        this.chart = null
      }
      this.lastUpdateByTopic = new Map()
    },
    createChart() {
      if (this.topics.length < 2) {
        return
      }
      const prefix = commonPrefix(this.topics.map(topicDisplayString))
      const xTopic = trimPrefix(topicDisplayString(this.topics[0]), prefix + "/")
      const yTopic = trimPrefix(topicDisplayString(this.topics[1]), prefix + "/")

      this.chart = new Chart(this.$refs.chart, {
        type: 'scatter',
        data: {
          datasets: [{
            label: yTopic + " vs. " + xTopic,
            data: [],
            parsing: false,
            normalized: true,
          }]
        },
        options: {
          colors: {
            enabled: false,
          },
          animation: false,
          scales: {
            x: {
              type: 'linear',
              ticks: {
                minRotation: 0,
                maxRotation: 0,
                sampleSize: 3,
                color: '#eee',
              },
              grid: {
                color: '#444',
              },
            },
            y: {
              grid: {
                color: '#666',
              },
              ticks: {
                color: '#eee',
              },
            }
          },
          plugins: {
            zoom: {
              pan: {
                enabled: true,
                mode: 'xy',
              },
              zoom: {
                mode: 'xy',
                scaleMode: 'xy',
                pinch: {
                  enabled: true
                },
                wheel: {
                  enabled: true
                },
              },
            },
          },
        }
      })
      this.chart.buildOrUpdateControllers()
    },
    prune() {
      if (!this.chart) {
        return
      }
      const data = this.chart.data.datasets[0].data
      const limit = 1800

      if (data.length > limit) {
        const overage = data.length - limit
        data.splice(0, overage)
        console.log("pruned", overage, "points from scatterplot")
      }
    },
    onRefresh() {
      this.prune()

      if (!this.chart) {
        return
      }

      // query your data source and get the array of {x: timestamp, y: value} objects
      const data = this.chart.data.datasets[0].data
      let updatedTimestamp = 0

      if (this.topics.length < 2) {
        return
      }
      const xTopic = this.topics[0]
      const yTopic = this.topics[1]

      const xLastUpdate = this.lastUpdateByTopic.get(xTopic) || 0
      const yLastUpdate = this.lastUpdateByTopic.get(yTopic) || 0

      const xData = NTDataReceiver.instance.getDataSince(xTopic, xLastUpdate)
      const yData = NTDataReceiver.instance.getDataSince(yTopic, yLastUpdate)

      if (!xData || !yData) {
        return
      }
      let yi = 0
      let added = 0

      for (let xi = 0; xi < xData.length; xi++) {
        if (yi >= yData.length) {
          break
        }
        let xTime = xData[xi].x
        let yTime = yData[yi].x
        while (yTime < xTime && yi < yData.length - 1) {
          yi++
          yTime = yData[yi].x
        }
        if (yi < yData.length) {
          const xVal = xData[xi].y
          const yVal = yData[yi].y

          data.push({ x: xVal, y: yVal })
          added++
        }
      }

      console.log("processed", xData.length, yData.length, "data points")
      console.log("added", added, "data points to scatterplot, total", data.length)
      this.lastUpdateByTopic.set(xTopic, xData.at(-1).x)
      this.lastUpdateByTopic.set(yTopic, yData.at(-1).x)
      this.chart.update()
    }
  }
}
</script>
