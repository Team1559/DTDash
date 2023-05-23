<template>
  <v-card
    class="panel"
    variant="outlined"
  >
    <p class="label text">
      {{ spec.title }}
    </p>
    <Graph
      v-if="isGraph"
      :topics="topics"
    />
    <Scatter
      v-if="isScatter"
      :topics="topics"
    />
    <div
      v-if="isText"
      class="text"
    >
      <table density="compact">
        <tr
          v-for="(topic, index) in this.topics"
          :key="topic"
        >
          <td class="label">
            {{ getLabel(index) }}
          </td>
          <td
            class="value"
            :style="textStyle"
          >
            {{ getValue(topic) }}
          </td>
        </tr>
      </table>
    </div>
  </v-card>
</template>

<script setup>
import { NTDataReceiver } from '@/classes/NTDataReceiver.js'
import VisType from '@/classes/VisType.js'
import Graph from '@/components/Graph.vue'
import Scatter from '@/components/Scatter.vue'
</script>

<script>
export default {
  name: 'Panel',
  props: {
    spec: Object,
    blockSize: Object,
  },
  emits: ['panel-close'],
  data: () => ({
    currentValues: new Map(),
  }),
  created() {
    this.updateValues()
  },
  computed: {
    isGraph() {
      return this.spec.visType === VisType.Graph
    },
    isScatter() {
      return this.spec.visType === VisType.Scatterplot
    },
    isText() {
      return this.spec.visType === VisType.Text
    },
    textStyle() {
      return "color: " + this.spec.colors[0] + "; "
    },
    topics() {
      return this.spec.topics
    },
  },
  methods: {
    getLabel(index) {
      return this.spec.labels[index]
    },
    getValue(topic) {
      const value = this.currentValues.get(topic)
      const pad = " "
      if (Number.isFinite(value)) {
        return value.toPrecision(3)
        const s = value.toPrecision(3)
        const parts = s.split('.')
        if (parts.length > 1) {
          return parts[0] + '.' + parts[1].padEnd(3, pad)
        }
        return s + pad.repeat(4)
      }
      // something other than a number
      return value
    },
    updateValues() {
      // Update current value for each topic.
      // Used by text and gauges.
      const ntReceiver = NTDataReceiver.instance
      this.topics.forEach(topic => {
        const values = ntReceiver.getDataForTopic(topic)
        if (values.length > 0) {
          const value = values.at(-1).y
          this.currentValues.set(topic, value)
        } else {
          this.currentValues.set(topic, "")
        }
      })
      setTimeout(this.updateValues.bind(this), 500)
    },
  },
}
</script>
<style>
.panel {
  padding: 8px;
}

.text {
  margin: 10px;
}

.label {
  font-family: "monospace";
  font-size: 12px;
  color: #eee;
  padding-right: 20px;
  overflow: clip;
}

.value {
  font-family: "monospace";
  font-size: 24px;
  text-align: right;
}
</style>
