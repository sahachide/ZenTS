<template>
  <section class="grid grid-cols-2 gap-12 mb-56">
    <div>
      <LandingPage-ContentText
        :title="$props.title"
        :headline="$props.headline"
        :sub-headline="$props.subHeadline"
      >
        <slot></slot>
      </LandingPage-ContentText>
    </div>
    <div class="flex content-center">
      <img :src="imgSrc" />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    subHeadline: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  computed: {
    imgSrc() {
      return this.$withBase(`/landingpage/${this.$props.image}.svg`)
    },
  },
}
</script>