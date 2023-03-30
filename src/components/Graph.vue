<template>
  <div>
    <canvas ref="chart">
    </canvas>
  </div>
</template>

<script setup>
import { Chart } from 'chart.js'
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
        datasets: this.$props.topics.map(topic => ({
          label: topic,
          data: [],
          parsing: false,
        }))
      },
      options: {
        colors: {
          enabled: true,
          forceOverride: true
        },
        elements: {
          line: {
          },
        },
        crosshair: {
        },
        scales: {
          x: {
            type: 'realtime',
            realtime: {
              duration: 3 * 60 * 1000,
              delay: 100,
              ttl: 15 * 60 * 1000,
              refresh: 100,
              onRefresh: chart => {
                // query your data source and get the array of {x: timestamp, y: value} objects
                this.topics.forEach((topic, index) => {
                  const data = NTDataReceiver.instance.getQueuedDataForTopic(topic)
                  var done = false
                  for (const dataset of chart.data.datasets) {
                    if (dataset.label === topic) {
                      dataset.data.push(...data)
                      done = true
                      break
                    }
                  }
                  if (!done) {
                    chart.data.datasets.push({
                      label: topic,
                      data: data,
                      parsing: false,
                    })
                    chart.buildOrUpdateControllers()
                  }
                })
              }
            },
          },
          y: {
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
  }),
  computed: {
  },
  methods: {
  }
}
</script>
