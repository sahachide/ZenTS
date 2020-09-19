<template>
  <div>
    <h3 v-if="title.length" class="uppercase font-nunito-light mb-10">{{ title }}</h3>
    <h6 class="content-title font-quicksand-bold text-6xl leading-normal mb-20">
      {{ headline }}
      <span class="font-quicksand-light text-4xl sub-text">{{ subHeadline }}</span>
    </h6>
    <p class="lg:w-3/4 w-full">
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    headline: {
      type: String,
      required: true,
    },
    subHeadline: {
      type: String,
      required: true,
    },
  },
}
</script>