<template>
  <td :style="indentStyle" :id="path">
    <v-icon v-if="selected" icon="mdi-check" />
    {{ name }}
  </td>
</template>

<script>
export default {
  props: {
    indent: Number,
    path: String,
    name: String,
    selected: Boolean,
  },
  data: () => ({
  }),
  computed: {
    indentStyle() {
      return 'padding-left: ' + (this.indent) * 15 + "px;"
    },
  },
  methods: {
  }
}
</script>
