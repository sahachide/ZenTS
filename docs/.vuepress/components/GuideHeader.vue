<template>
  <div>
    <div class="reading-time">
      {{ $page.readingTime.text }} ({{ $page.readingTime.words }} words)
    </div>
    <div class="illustration-container">
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
.illustration-container {
  margin-bottom: 6rem;
  margin-top: 4rem;
  display: flex;
  justify-content: center;

  .illustration-image {
    max-height: 400px;
  }
}

.reading-time {
  color: #767676;
  margin-top: -22px
  font-size: 0.75em;
}
</style>
