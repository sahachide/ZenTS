<template>
  <div>
    {{ text }}
  </div>
</template>

<script>
export default {
  computed: {
    text() {
      return this.$page.readingTime.text
    },
  },
}
</script>

<style lang="stylus" scoped></style>