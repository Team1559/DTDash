/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'

import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon'
import ChartStreaming from 'chartjs-plugin-streaming'
import zoomPlugin from 'chartjs-plugin-zoom'
// import { Interaction } from 'chart.js'
// import { CrosshairPlugin, Interpolate } from 'chartjs-plugin-crosshair'

export function registerPlugins(app) {
  loadFonts()
  app.use(vuetify)

  Chart.register(ChartStreaming)
  Chart.register(zoomPlugin)
  // Chart.register(CrosshairPlugin)
  // Interaction.modes.interpolate = Interpolate
}
