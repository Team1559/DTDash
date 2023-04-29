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
import { NTDataReceiver } from '../classes/NTDataReceiver.js'
import { topicDisplayString, commonPrefix, trimPrefix } from '@/classes/Format.js'

Chart.defaults.color = '#eee'
</script>

<script>
const frameRate = 10

function minutesToMs(n) {
  return n * 60 * 1000
}
const windowTime = minutesToMs(3)
const ttl = minutesToMs(15)

export default {
  // This is a weird Vue component. Normally, Vue components re-render
  // to create new (virtual) DOM when props or data change. In this
  // case, the DOM remains unchanged, containing only a canvas.
  // Component state is reflected in the embedded Chart object. We don't
  // want to destroy and recreate that all the time because it will
  // flicker.
  name: 'Graph',
  props: {
    topics: Array,
    width: String,
    height: String,
  },
  mounted() {
    this.createChart()
  },
  updated() {
    // See if the chart size changed (in the Editor)
    const canvas = this.$refs.chart
    if (canvas.width !== this.width || canvas.height !== this.height) {
      this.createChart()
    }
    // See if we deleted a topic
    const datasets = this.chart.data.datasets
    for (let i = datasets.length - 1; i >= 0; i--) {
      if (!this.topics.includes(datasets[i].topic)) {
        this.lastUpdateByTopic.set(datasets[i].topic, 0)
        datasets.splice(i)
      }
    }
  },
  data: () => ({
    chart: null,
    lastUpdateByTopic: new Map(),
    colors: scaleOrdinal(schemeCategory10),
  }),
  computed: {
  },
  methods: {
    createChart() {
      if (this.chart !== null) {
        this.chart.destroy()
        this.chart = null
        this.lastUpdateByTopic = new Map()
      }
      this.chart = new Chart(this.$refs.chart, {
        type: 'line',
        data: {
          // Data will be added in onRefresh
          datasets: []
        },
        options: {
          colors: {
            enabled: false,
          },
          elements: {
            line: {
              borderWidth: 1,
            },
            point: {
              pointStyle: false,
            },
          },
          crosshair: {
          },
          animation: false,
          spanGaps: true, // Recommended for performance, but can we drop it?
          scales: {
            x: {
              type: 'realtime',
              ticks: {
                minRotation: 0,
                maxRotation: 0,
                sampleSize: 3,
                color: '#eee',
              },
              grid: {
                color: '#444',
              },
              realtime: {
                duration: windowTime,
                delay: 1000 / frameRate,
                ttl: ttl,
                refresh: 1000 / frameRate,
                frameRate: frameRate,
                onRefresh: this.onRefresh,
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
            // crosshair: {
            //   line: {
            //     color: '#F66',
            //     width: 1
            //   },
            //   sync: {
            //     enabled: true,
            //     group: 1,
            //     suppressTooltips: false
            //   },
            //   zoom: {
            //     enabled: true,
            //     zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',
            //     zoomboxBorderColor: '#48F',
            //     zoomButtonText: 'Reset Zoom',
            //     zoomButtonClass: 'reset-zoom',
            //   }
            // },
            zoom: {
              pan: {
                enabled: true,
                mode: 'x',
              },
              zoom: {
                enabled: false,
                mode: 'x',
                scaleMode: 'xy',
                pinch: {
                  enabled: true
                },
                wheel: {
                  enabled: true
                },
              },
              limits: {
                x: {
                  minDelay: null,
                  maxDelay: null,
                  minDuration: windowTime / 10,
                  maxDuration: ttl,
                }
              }
            },
          },
        }
      })
    },
    datasetForTopic(topic, colorIndex, data) {
      let prefix = commonPrefix(this.topics.map(topicDisplayString))

      return {
        topic: topic,
        label: trimPrefix(topicDisplayString(topic), prefix + "/"),
        data: data || [],
        parsing: false,
        normalized: true,
        borderColor: this.colors(colorIndex || 0),
        topic: topic,
      }
    },
    onRefresh(chart) {
      // query your data source and get the array of {x: timestamp, y: value} objects
      let updatedTimestamp = 0
      const datasets = chart.data.datasets

      this.topics.forEach((topic, index) => {
        const lastUpdate = this.lastUpdateByTopic.get(topic) || 0
        const data = NTDataReceiver.instance.getDataSince(topic, lastUpdate)
        if (data.length > 0) {
          this.lastUpdateByTopic.set(topic, data.at(-1).x)
        }
        let done = false
        for (const dataset of datasets) {
          if (dataset.topic === topic) {
            dataset.data.push(...data)
            done = true
            break
          }
        }
        if (!done) {
          datasets.push(this.datasetForTopic(topic, datasets.length, data))
          chart.buildOrUpdateControllers()
        }
      })
    }
  }
}
</script>
