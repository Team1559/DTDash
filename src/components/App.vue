<template>
  <v-card>
    <v-layout>
      <v-app-bar>
        <v-app-bar-nav-icon @click.stop="showNav = !showNav"></v-app-bar-nav-icon>
        <v-icon v-if="connected" icon="mdi-wifi" color="green" />
        <v-icon v-else icon="mdi-wifi-off" color="red" />
        <v-app-bar-title>DT Dashboard</v-app-bar-title>
      </v-app-bar>

      <v-banner v-if="!connected" color="red" icon="mdi-wifi-offbox" lines="one">
        <v-banner-text>
          Robot disconnected
        </v-banner-text>
      </v-banner>

      <v-navigation-drawer floating title="Variables" app v-model="showNav" height="100%">
        <table class="mono">
          <VariableList :tree="topicTree" :onSelectTopics="onSelectTopics" />
        </table>
      </v-navigation-drawer>

      <v-main style="min-height: 100dvh; ">
        <v-card v-if="haveSelection()">
          <Graph :topics="getSelectedNames()">
          </Graph>
        </v-card>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { NTDataReceiver } from '../classes/NTDataReceiver.js'
import VariableList from '@/components/VariableList.vue'
import Graph from '@/components/Graph.vue'
</script>

<script>
export default {
  name: 'App',
  data: () => ({
    showNav: false,
    selectedTopics: new Set(),
    updateQueues: new Map(),
    topicTree: NTDataReceiver.instance.topicTree,
  }),
  created() {
    NTDataReceiver.instance.handleTopicTreeChanged(this.onTopicTreeChanged.bind(this))
  },
  methods: {
    connected() {
      return NTDataReceiver.instance.isConnected()
    },
    onSelectTopics(topics) {
      this.selectedTopics = topics
    },
    onTopicTreeChanged(tree) {
      this.topicTree = tree.flatten()
    },
    haveSelection() {
      return this.selectedTopics.size !== 0
    },
    getSelectedNames() {
      var names = []
      for (const name of this.selectedTopics) {
        names.push(name)
      }
      return names
    }
  },
};
</script>
<style>
.mono {
  font-family: "monospace";
  font-size: 12px;
}
</style>
