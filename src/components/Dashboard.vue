<template>
  <v-row
    no-gutters
    justify="stretch"
  >
    <v-col
      v-for="(_, index) in spec.columns"
      cols="3"
      class="column"
    >
      <draggable
        v-model="spec.columns[index]"
        class="fill-height"
      >
        <template v-slot:item="{ item }">
          <Panel
            :key="item.id"
            :spec="item"
            :blockSize="spec.blockSize"
          />
        </template>
      </draggable>
    </v-col>
  </v-row>
</template>

<script setup>
import DashboardSpec from '@/classes/DashboardSpec.js'
import Size from '@/classes/Size'
import Panel from '@/components/Panel.vue'
import Draggable from "vue3-draggable"
</script>

<script>
export default {
  name: 'Dashboard',
  components: {
    Draggable,
  },
  props: {
    spec: DashboardSpec,
  },
  emits: ['panel-close'],
  data: () => ({
  }),
  computed: {
    panelSpecs() {
      return this.spec.panels
    },
    blockSize() {
      return this.spec.blockSize
    }
  },
  methods: {
    resize() {
      console.log("resize: ", arguments)
    },
    move() {
      console.log("move: ", arguments)
    },
    moved() {
      console.log("moved: ", arguments)
    },
  },
}
</script>
<style>
.column {
  border-right: 1px solid gray;
}
</style>
