<template>
  <v-card>
    <v-layout>
      <v-app-bar>
        <v-app-bar-nav-icon @click.stop="showNav = !showNav"></v-app-bar-nav-icon>
        <v-icon v-if="connected" icon="mdi-wifi" color="green" />
        <v-icon v-else icon="mdi-wifi-off" color="red" />
        <v-app-bar-title>DT Dashboard</v-app-bar-title>
      </v-app-bar>

      <v-banner v-if="!connected" color="red" icon="mdi-wifi-off" lines="one">
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
          <Graph :topics="Array.from(selectedTopics)">
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
    topicTree: [],
    connected: false,
  }),
  created() {
    const ntReceiver = NTDataReceiver.instance
    ntReceiver.handleTopicTreeChanged(this.onTopicTreeChanged.bind(this))
    ntReceiver.handleConnectionStateChanged(this.onConnectionStateChanged.bind(this))
  },
  methods: {
    onSelectTopics(topics) {
      this.selectedTopics = topics
    },
    onTopicTreeChanged(tree) {
      this.topicTree = tree.flatten()
    },
    onConnectionStateChanged(connected) {
      this.connected = connected
    },
    haveSelection() {
      return this.selectedTopics.size !== 0
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
