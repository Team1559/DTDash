<template>
  <v-card>
    <v-layout>
      <v-app-bar>
        <v-app-bar-nav-icon
          icon="mdi-plus-circle"
          color="blue"
          size="large"
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
        <v-spacer />

        <v-app-bar-nav-icon
          icon="mdi-download"
          color="blue"
          size="large"
          @click="downloadDashboardSpec"
        >
        </v-app-bar-nav-icon>

        <v-dialog
          v-model="uploadDialog"
          width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-app-bar-nav-icon
              icon="mdi-upload"
              color="blue"
              size="large"
              v-bind="props"
            >
            </v-app-bar-nav-icon>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Load Layout</span>
            </v-card-title>
            <v-card-text>
              Select a previously downloaded dashboard layout file.
            </v-card-text>
            <v-file-input
              v-model="uploadFiles"
              label="Select layout file"
            ></v-file-input>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue"
                @click="uploadDialog = false"
              >Cancel</v-btn>
              <v-btn
                color="blue"
                @click="uploadDialog = false; uploadDashboardSpec()"
              >Load</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="saveDialog"
          width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-app-bar-nav-icon
              icon="mdi-content-save"
              color="blue"
              v-bind="props"
            >
            </v-app-bar-nav-icon>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Save Layout</span>
            </v-card-title>
            <v-card-text>
              Enter a name to save the dashboard layout.
            </v-card-text>
            <v-text-field
              label="Name"
              hint="Unique name for the layout"
              color="blue"
              v-model="spec.name"
              required
            ></v-text-field>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue"
                @click="saveDialog = false"
              >Cancel</v-btn>
              <v-btn
                color="blue"
                @click="saveDialog = false; saveDashboardSpec()"
              >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-select
          dense
          label="Layout"
          :items="layouts"
          item-title="name"
          v-model="spec"
          style="max-width: 250px; padding-top: 20px"
          return-object
        >
        </v-select>
      </v-app-bar>

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
            :columns="spec.columns.length"
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
import { DashboardSpec } from '@/classes/DashboardSpec.js'
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
  data: function () {
    const spec = new DashboardSpec(4)
    return {
      showNav: false,
      selectedTopics: new Set(),
      updateQueues: new Map(),
      topicTree: [],
      connected: false,
      spec: spec,
      newPanelSpec: new PanelSpec(),
      layouts: this.loadLayouts() || [spec],
      saveDialog: false,
      uploadDialog: false,
      uploadFiles: null,
    }
  },
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
    loadLayouts() {
      let savedLayouts = localStorage.layouts
      if (!savedLayouts) {
        return null
      }
      return JSON.parse(savedLayouts)
    },
    onSelectTopics(topics) {
      this.selectedTopics = topics
      this.newPanelSpec.setTopics(Array.from(this.selectedTopics))
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
      this.spec.columns[panel.column].push(panel)
      this.clearSelection()
    },
    removePanel(panel) {
      for (let column of this.spec.columns) {
        const index = column.indexOf(panel)
        if (index !== -1) {
          column.splice(index)
          return
        }
      }
    },
    downloadDashboardSpec() {
      const data = btoa(JSON.stringify(this.spec))
      let link = document.createElement("a")
      link.download = this.spec.name + ".json"
      link.href = "data:text/plain;base64," + data
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    uploadDashboardSpec() {
      let file = this.uploadFiles[0]
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (function () {
        let layout = JSON.parse(reader.result)
        this.layouts.push(layout)
        this.spec = layout
      }).bind(this)
      reader.onerror = function () {
        alert(reader.error)
      }
    },
    saveDashboardSpec() {
      localStorage.layouts = JSON.stringify(this.layouts)
      this.layouts.splice(0, 0, new DashboardSpec(4))
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
