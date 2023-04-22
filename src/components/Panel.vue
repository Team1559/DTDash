<template>
  <v-card
    elevation="5"
    :width="width"
    :height="height"
    :style="style"
  >
    <Graph
      v-if="isGraph"
      :width="width"
      :height="height"
      :topics="topics"
    >
    </Graph>
    <div v-if="isText">
      <table density="compact">
        <tr
          v-for="topic in this.topics"
          :key="topic"
        >
          <td class="label">
            {{ topicDisplayString(topic) }}
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
import { topicDisplayString } from '@/classes/Format.js'
import { NTDataReceiver } from '@/classes/NTDataReceiver.js'
import PanelSpec from '@/classes/PanelSpec.js'
import VisType from '@/classes/VisType.js'
import Graph from '@/components/Graph.vue'
</script>

<script>
export default {
  name: 'Panel',
  props: {
    spec: PanelSpec,
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
    isText() {
      return this.spec.visType === VisType.Text
    },
    textStyle() {
      return "color: " + this.spec.colors[0] + "; "
    },
    width() {
      return this.size.w * this.blockSize.w + "px"
    },
    height() {
      return this.size.h * this.blockSize.h + "px"
    },
    sizeStyle() {
      return ""
      // ("width: " + this.width + "; " +
      //   "height: " + this.height + "; " +
      //   "max-width: " + this.width + "; " +
      //   "max-height: " + this.height + "; ")
    },
    style() {
      return this.textStyle + this.sizeStyle
    },
    topics() {
      return this.spec.topics
    },
    size() {
      return this.spec.size
    },
  },
  methods: {
    getValue(topic) {
      const value = this.currentValues.get(topic)
      const pad = " "
      if (Number.isFinite(value)) {
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
