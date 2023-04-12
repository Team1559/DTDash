<template>
  <div>
    <apexchart width="500" height="350" type="area" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
export default {
  props: {
    dataset: Array,
    names: Array,
  },
  data: () => ({
    chartOptions: {
      xaxis: {
        type: 'datetime',
      },
      dataLabels: {
        enabled: false
      },
      type: "line",
      stroke: {
        curve: 'straight',
        width: 0.5,
      },
      tooltip: {
        fixed: {
          enabled: false,
          position: 'topRight'
        }
      }
    }
  }),
  computed: {
    series() {
      var s = []
      for (var i = 0; i < this.dataset.length; i++) {
        s.push({
          name: this.names[i],
          data: this.dataset[i],
        })
      }
      return s
    }
  },
  methods: {
  }
}
</script>
