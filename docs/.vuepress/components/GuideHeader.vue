<template>
  <div>
    <div class="text-xs reading-time -mt-5">
      {{ $page.readingTime.text }} ({{ $page.readingTime.words }} words)
    </div>
    <div class="flex justify-center mt-16 mb-24">
      <img class="illustration-image" :src="illustration" />
    </div>
    <h2><a href="#" class="header-anchor">#</a> Table of contents</h2>
    <div><slot></slot></div>
  </div>
</template>

<script>
export default {
  props: {
    guide: {
      type: String,
      required: true,
    },
  },
  computed: {
    readingTime() {
      return this.$page.readingTime.text
    },
    illustration() {
      return this.$withBase(`/guide/${this.$props.guide}.svg`)
    },
  },
}
</script>

<style lang="stylus" scoped>
.illustration-image {
  max-height: 400px;
}

.reading-time {
  color: #767676;
}
</style>