<template>
  <div class="flex justify-center my-16">
    <img class="guide-image" :src="imgSrc" />
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: String,
      required: true,
    },
  },
  computed: {
    imgSrc() {
      return this.$withBase(`/guide/${this.$props.page}.svg`)
    },
  },
}
</script>

<style lang="stylus" scoped>
.guide-image {
  max-height: 400px;
}
</style>