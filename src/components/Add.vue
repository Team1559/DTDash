<template>
  <v-card>
    <v-toolbar>
      <v-select label="Show as" :items="VisType.All" v-model="visType" style="max-width: 200px">
        <template #selection="{ item }">
          <v-icon color="blue" style="padding-right: 12px">{{ getVisTypeIcon(item.value) }}</v-icon>
          {{ item.title }}
        </template>
      </v-select>
      <v-btn class="ma-2" color="blue" icon="mdi-plus-circle" width="64px" height="64px"></v-btn>
    </v-toolbar>
    <Graph v-if="isGraph" :topics="topics">
    </Graph>
    <div v-if="isText">
      <layout v-for="topic in this.topics" :key="topic">
        <div class="label">
          {{ topicDisplayString(topic) }}
        </div>
        <div class="value" :style="textStyle">
          {{ getValue(topic) }}
        </div>
      </layout>
    </div>
  </v-card>
</template>

<script setup>
import Graph from '@/components/Graph.vue'
import VisType from '@/classes/VisType.js'
import { NTDataReceiver } from '../classes/NTDataReceiver.js'
import { topicDisplayString } from '../classes/Format.js'
</script>

<script>
export default {
  name: 'Add',
  props: {
    topics: Array,
  },
  data: () => ({
    hsize: 2,
    vsize: 2,
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
};
</script>
<style>
.label {
  font-family: "monospace";
  font-size: 12px;
  text-align: center;
  color: gray;
  padding-top: 10px;
}

.value {
  font-family: "monospace";
  font-size: 24px;
  text-align: center;
  color: red;
}
</style>
