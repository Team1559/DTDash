<template>
  <v-app>
    <v-main>
      <App :keyPrefix="keyPrefix" />
    </v-main>
  </v-app>
</template>

<script setup>
import { NTDataReceiver } from './classes/NTDataReceiver.js'
import App from '@/components/App.vue'

const keyName = "SmartDashboard"
const keyPrefix = "/" + keyName + "/"
const ntDataReceiver = new NTDataReceiver(window.location.hostname, keyPrefix)
</script>
