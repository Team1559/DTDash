<template>
  <Panel
    v-for="panelSpec in this.panelSpecs"
    :key="panelSpec.id"
    :spec="panelSpec"
    :blockSize="blockSize"
  >
  </Panel>
</template>

<script setup>
import DashboardSpec from '@/classes/DashboardSpec.js'
import Panel from '@/components/Panel.vue'
</script>

<script>
export default {
  name: 'Dashboard',
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
  },
}
</script>
