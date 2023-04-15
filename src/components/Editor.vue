<template>
  <v-card>
    <v-toolbar>
      <v-select
        label="Show as"
        :items="VisType.All"
        v-model="visType"
        style="max-width: 200px"
      >
      </v-select>
      <v-select
        label="Size"
        :items="AllSizes()"
        v-model="size"
        item-title="displayName"
        item-value="dimensions"
        return-object
        style="max-width: 150px"
      >
      </v-select>
      <v-btn
        class="ma-2"
        color="blue"
        icon="mdi-check"
      ></v-btn>
      <v-btn
        class="ma-2"
        color="blue"
        icon="mdi-close"
        @click="$emit('close-editor')"
      ></v-btn>
    </v-toolbar>
    <Graph
      v-if="isGraph"
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
import Graph from '@/components/Graph.vue'
import VisType from '@/classes/VisType.js'
import { NTDataReceiver } from '../classes/NTDataReceiver.js'
import { topicDisplayString } from '../classes/Format.js'
import { AllSizes } from '@/classes/Size'
</script>

<script>
export default {
  name: 'Editor',
  props: {
    topics: Array,
  },
  emits: ['close-editor'],
  data: () => ({
    size: "2x2",
    color: "red",
    visType: VisType.Text,
    currentValues: new Map(),
  }),
  created() {
    this.updateValues()
  },
  computed: {
    isGraph() {
      return this.visType === VisType.Graph
    },
    isText() {
      return this.visType === VisType.Text
    },
    textStyle() {
      return "color: " + this.color
    }
  },
  methods: {
    getValue(topic) {
      const value = this.currentValues.get(topic)
      if (Number.isFinite(value)) {
        return value.toPrecision(3)
        // if (value < 0) {
        //   return value.toPrecision(3)
        // }
        // else {
        //   return "&nbsp;" + value.toPrecision(3)
        // }
      }
      return value
    },
    updateValues() {
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
    getVisTypeIcon(item) {
      switch (item) {
        case VisType.Text:
          return 'mdi-format-text'
        case VisType.Graph:
          return 'mdi-chart-line'
        case VisType.ArcGauge:
          return 'mdi-chart-arc'
        case VisType.BarGauge:
          return 'mdi-window-minimize'
      }
    }
  },
}
</script>
<style>.label {
  font-family: "monospace";
  font-size: 12px;
  color: gray;
  padding-right: 20px;
}

.value {
  font-family: "monospace";
  font-size: 24px;
  color: red;
}</style>
