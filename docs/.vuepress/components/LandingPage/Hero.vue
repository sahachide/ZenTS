<template>
  <div class="hero grid grid-cols-12 gap-4 px-8 py-16 rounded-lg mt-24">
    <div class="col-span-4 flex items-center">
      <div class="mx-6">
        <h1 class="font-nunito-bold text-xl mb-1">ZenTS</h1>
        <p class="sub-text tracking-wider font-rubik text-3xl leading-tight">
          Node.js &amp; TypeScript MVC-Framework for building rich web applications
        </p>
        <div class="text-center">
          <a href="/guide/" class="mt-8 button">Documentation</a>
        </div>
      </div>
    </div>
    <div class="col-span-8 flex content-center">
      <img :src="$withBase('/landingpage/hero.svg')" />
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.hero {
  background-color: rgba(255, 255, 255, 0.6);

  h1 {
    color: $accentColor;
  }

  .sub-text {
    color: rgb(113, 108, 128);
  }
}
</style>