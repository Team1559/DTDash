<template>
  <v-app>
    <v-main>
      <App :keyPrefix="keyPrefix" />
    </v-main>
  </v-app>
</template>

<script setup>
import App from '@/components/App.vue'
import { NTDataReceiver } from './classes/NTDataReceiver.js'

const keyName = "SmartDashboard"
const keyPrefix = "/" + keyName + "/"
const ntDataReceiver = new NTDataReceiver(window.location.hostname, keyPrefix, 10 * 60 * 1000)
</script>
