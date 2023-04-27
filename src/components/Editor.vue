<template>
  <v-card>
    <v-toolbar>
      <v-select
        dense
        label="Show as"
        :items="VisType.All"
        v-model="currentSpec.visType"
        style="max-width: 200px"
      />
      <v-select
        dense
        label="Column"
        :items="columnNumbers"
        v-model="currentSpec.column"
        style="max-width: 150px"
      >
      </v-select>
      <v-btn
        class="ma-2"
        color="blue"
        icon="mdi-check"
        @click="$emit('editor-save', currentSpec)"
      ></v-btn>
      <v-btn
        class="ma-2"
        color="blue"
        icon="mdi-close"
        @click="$emit('editor-close')"
      ></v-btn>
    </v-toolbar>
    <Panel
      :spec="currentSpec"
      :blockSize="blockSize"
    >
    </Panel>
  </v-card>
</template>

<script setup>
import Size from '@/classes/Size.js'
import VisType from '@/classes/VisType.js'
import Panel from '@/components/Panel.vue'
</script>

<script>
export default {
  name: 'Editor',
  props: {
    spec: Object,
    blockSize: Object,
    columns: Number,
  },
  emits: ['editor-save', 'editor-close'],
  data() {
    return {
      currentSpec: this.spec,
    }
  },
  computed: {
    isGraph() {
      return this.currentSpec.visType === VisType.Graph
    },
    isText() {
      return this.currentSpec.visType === VisType.Text
    },
    textStyle() {
      return "color: " + this.currentSpec.colors[0]
    },
    topics() {
      return this.currentSpec.topics
    },
    columnNumbers() {
      var nums = []
      for (var i = 0; i < this.columns; i++) {
        nums.push(i)
      }
      return nums
    },
  },
  methods: {
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
