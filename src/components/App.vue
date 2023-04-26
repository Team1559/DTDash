<template>
  <v-card>
    <v-layout>
      <v-app-bar>
        <v-app-bar-nav-icon
          icon="mdi-plus-circle"
          color="blue"
          @click.stop="showNav = !showNav"
        ></v-app-bar-nav-icon>
        <v-icon
          v-if="connected"
          icon="mdi-wifi"
          color="green"
        />
        <v-icon
          v-else
          icon="mdi-wifi-off"
          color="red"
        />
        <v-app-bar-title>DT Dashboard</v-app-bar-title>
      </v-app-bar>

      <v-banner
        v-if="!connected"
        color="red"
        icon="mdi-wifi-off"
        lines="one"
      >
        <v-banner-text>
          Robot disconnected
        </v-banner-text>
      </v-banner>

      <v-navigation-drawer
        floating
        title="Variables"
        app
        v-model="showNav"
        height="100%"
      >
        <table class="mono">
          <VariableList
            :tree="topicTree"
            :onSelectTopics="onSelectTopics"
          />
        </table>
      </v-navigation-drawer>

      <v-main style="min-height: 100dvh; ">
        <v-card v-if="haveSelection">
          <Editor
            :spec="newPanelSpec"
            :blockSize="spec.blockSize"
            @editor-save="saveNewPanel"
            @editor-close="clearSelection"
          />
        </v-card>
        <v-card v-else>
          <Dashboard :spec="spec" />
        </v-card>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import DashboardSpec from '@/classes/DashboardSpec.js'
import PanelSpec from '@/classes/PanelSpec.js'
import { NTDataReceiver } from '@/classes/NTDataReceiver.js'
import Dashboard from '@/components/Dashboard.vue'
import Editor from '@/components/Editor.vue'
import VariableList from '@/components/VariableList.vue'
import VisType from '@/classes/VisType'
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
    spec: new DashboardSpec(),
    newPanelSpec: new PanelSpec(),
  }),
  created() {
    const ntReceiver = NTDataReceiver.instance
    ntReceiver.handleTopicTreeChanged(this.onTopicTreeChanged.bind(this))
    ntReceiver.handleConnectionStateChanged(this.onConnectionStateChanged.bind(this))
  },
  computed: {
    haveSelection() {
      return this.selectedTopics.size !== 0
    },
  },
  methods: {
    onSelectTopics(topics) {
      this.selectedTopics = topics
      this.newPanelSpec.topics = Array.from(this.selectedTopics)
    },
    onTopicTreeChanged(tree) {
      this.topicTree = tree.flatten()
    },
    onConnectionStateChanged(connected) {
      this.connected = connected
    },
    clearSelection() {
      this.selectedTopics.clear()
      this.newPanelSpec = new PanelSpec()
    },
    saveNewPanel(panel) {
      if (this.newPanelSpec.visType === VisType.Text) {
        this.newPanelSpec.h = this.newPanelSpec.topics.length
      }
      this.spec.addPanel(panel)
      this.clearSelection()
    },
  },
}
</script>
<style>
.mono {
  font-family: "monospace";
  font-size: 12px;
}
</style>
