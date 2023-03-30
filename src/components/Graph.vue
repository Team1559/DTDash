<template>
  <div>
    <canvas ref="chart">
    </canvas>
  </div>
</template>

<script setup>
import { Chart } from 'chart.js'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { NTDataReceiver } from '../classes/NTDataReceiver.js'
</script>

<script>
export default {
  name: 'Graph',
  props: {
    topics: Array,
  },
  mounted() {
    this.chart = new Chart(this.$refs.chart, {
      type: 'line',
      data: {
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
        spanGaps: true,
        scales: {
          x: {
            type: 'realtime',
            ticks: {
              minRotation: 0,
              maxRotation: 0,
              sampleSize: 3,
            },
            grid: {
              color: '#333',
            },
            realtime: {
              duration: 3 * 60 * 1000,
              delay: 100,
              ttl: 15 * 60 * 1000,
              refresh: 100,
              frameRate: 10,
              onRefresh: chart => {
                // query your data source and get the array of {x: timestamp, y: value} objects
                this.topics.forEach((topic, index) => {
                  const data = NTDataReceiver.instance.getQueuedDataForTopic(topic)
                  var done = false
                  for (const dataset of chart.data.datasets) {
                    if (dataset.label === this.topicDisplayString(topic)) {
                      dataset.data.push(...data)
                      done = true
                      break
                    }
                  }
                  if (!done) {
                    chart.data.datasets.push(this.datasetForTopic(topic, chart.data.datasets.length, data))
                    chart.buildOrUpdateControllers()
                  }
                })
              }
            },
          },
          y: {
            grid: {
              color: '#666',
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
              mode: 'x'
            },
            zoom: {
              pinch: {
                enabled: true
              },
              wheel: {
                enabled: true
              },
              mode: 'x'
            },
            limits: {
              x: {
                minDelay: null,
                maxDelay: null,
                minDuration: null,
                maxDuration: null
              }
            }
          },
        },
      }
    });
  },
  data: () => ({
    chart: null,
    colors: scaleOrdinal(schemeCategory10),
  }),
  computed: {
  },
  methods: {
    topicDisplayString(topic) {
      return topic.replace("/SmartDashboard/", "")
    },
    datasetForTopic(topic, colorIndex, data) {
      return {
        label: this.topicDisplayString(topic),
        data: data || [],
        parsing: false,
        normalized: true,
        borderColor: this.colors(colorIndex || 0),
      }
    }
  }
}
</script>
