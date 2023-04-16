<template>
  <v-card>
    <v-toolbar>
      <v-select
        dense
        label="Show as"
        :items="VisType.All"
        v-model="spec.visType"
        style="max-width: 200px"
      />
      <v-select
        dense
        label="Size"
        :items="Size.AllSizes()"
        v-model="spec.size"
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
import { NTDataReceiver } from '@/classes/NTDataReceiver.js'
import { topicDisplayString } from '@/classes/Format.js'
import VisType from '@/classes/VisType.js'
import Size from '@/classes/Size.js'
import PanelSpec from '@/classes/PanelSpec'
</script>

<script>
export default {
  name: 'Editor',
  props: {
    topics: Array,
  },
  emits: ['close-editor'],
  data: () => ({
    spec: new PanelSpec(),
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
      return "color: " + this.spec.colors[0]
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
<style>
.label {
  font-family: "monospace";
  font-size: 12px;
  color: 'white';
  padding-right: 20px;
}

.value {
  font-family: "monospace";
  font-size: 24px;
}
</style>
