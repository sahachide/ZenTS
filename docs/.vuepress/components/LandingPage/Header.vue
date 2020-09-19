<template>
  <header class="grid grid-cols-4">
    <div class="col-span-1">
      <img class="logo" :src="$withBase('/zents_logo_white.png')" />
    </div>
    <div class="col-span-3 pt-3">
      <nav class="container flex justify-end">
        <ul class="flex space-x-6 text-base nav-item uppercase font-nunito-light tracking-wider">
          <li>
            <a href="/guide/gettingstarted/installation" class="hover hover-1">Getting started</a>
          </li>
          <li>
            <a href="/guide/">Documentation</a>
          </li>
          <li>
            <a href="/guide/">Guides</a>
          </li>
          <li>
            <a href="/api/">API-Reference</a>
          </li>
          <li>
            <a href="#">Github</a>
          </li>
          <li class="dark-light-switcher-container">
            <img
              :src="$withBase('/dark_light_switcher.svg')"
              class="dark-light-switcher"
              @click="toggleDarkLight"
            />
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    toggleDarkLight() {
      const $html = document.getElementsByTagName('html')[0]
      const current = $html.getAttribute('theme') ?? 'dark'
      const next = current === 'dark' ? 'light' : 'dark'

      $html.setAttribute('theme', next)
    },
  },
}
</script>

<style lang="stylus" scoped>
header .logo {
  max-height: 50px;
  width: auto;
}

nav .nav-item a {
  color: #fff;
  transition: all 0.1s ease-in-out;
  position: relative;

  &:before, &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    width: 0px;
    height: 3px;
    margin: 5px 0 0;
    transition: all 0.1s ease-in-out;
    transition-duration: 0.5s;
    opacity: 0;
    background-color: #fff;
    left: 0;
  }

  &:hover {
    color: #fff;

    &:before, &:after {
      width: 100%;
      opacity: 1;
    }
  }
}
</style>
