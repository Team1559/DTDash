<template>
  <tr v-if="tree" v-for="[indent, path, name, hasChildren] in tree" class="variable-table-row">
    <Variable v-if="hasChildren" :name="name" :path="path" :indent="indent" />
    <Variable v-else @click="clickTopic" :name="name" :path="path" :indent="indent"
      :selected="this.selectedTopics.has(path)" />
  </tr>
</template>

<script setup>
import Variable from '@/components/Variable.vue'
</script>

<script>
export default {
  props: {
    tree: Object,
    onSelectTopics: Function,
  },
  data: () => ({
    selectedTopics: new Set(),
  }),
  computed: {
  },
  methods: {
    getSelectedTopics() {
      return this.selectedTopics;
    },
    clickTopic(e) {
      const name = e.target.id;
      if (this.selectedTopics.has(name)) {
        this.selectedTopics.delete(name)
      }
      else {
        this.selectedTopics.add(name)
      }
      if (this.onSelectTopics) {
        this.onSelectTopics(this.selectedTopics)
      }
    }
  }
}
</script>
<style>
.variable-table-row {
  min-width: 200px;
}

.variable-table-row :hover {
  background-color: #cc5;
  color: black;
  font-weight: bold;
}
</style>
