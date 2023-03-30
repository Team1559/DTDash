<template>
  <CanvasJSChart :options="options" :styles="styleOptions" />
</template>

<script setup>
import CanvasJSChart, { CanvasJS } from './CanvasJSVueComponent.vue';
</script>

<script>
export default {
  props: {
    dataset: Array,
    names: Array,
  },
  data: () => ({
    chart: null,
    styleOptions: {
      width: "100%",
      height: "360px"
    }
  }),
  computed: {
    options() {
      const xmin = this.dataset.length !== 0 && this.dataset[0][0].x
      const xmax = xmin + 5 * 60 * 1000
      return {
        animationEnabled: false,
        exportEnabled: true,
        theme: "dark",
        // title: {
        //   text: "UPI Transactions in India"
        // },
        axisX: {
          minimum: xmin,
          maximum: xmax,
          viewportMinimum: xmin,
          viewportMaximum: xmax
        // valueFormatString: "YYYY",
        // labelTextAlign: "center",
        // labelAngle: 0
        },
        // axisY: {
        // title: "Amount (in ₹ Crore)",
        // valueFormatString: "₹##,##,##0cr"
        // },
        toolTip: {
          shared: true
        },
        legend: {
          cursor: "pointer",
          itemclick: function (e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            }
            e.chart.render();
          }
        },
        data: (this.dataset || []).map((series, index) => ({
          type: "line",
          name: this.names[index],
          showInLegend: true,
          dataPoints: series,
        }))
      }
    }
  },
  methods: {
    chartInstance(chart) {
      this.chart = chart;
    },
    getChartData() {
      if (!this.dataset) {
        return []
      }
      return this.dataset.map((series, index) => ({
        type: "line",
        name: this.names[index],
        showInLegend: true,
        dataPoints: series,
      }))
    }
  }
}
</script>
