<template>
  <div class="landing-page font-nunito">
    <div class="custom-block danger beta-warning">
      <div class="container mx-auto py-4">
        ZenTS is still <strong><em>under heavy development</em></strong> and
        <strong><em>not</em></strong> ready for production use yet (breaking changes can be
        introduces at any time). Please report any issues on
        <a href="https://github.com/sahachide/ZenTS/issues" target="_blank">GitHub</a>.
      </div>
    </div>
    <section class="hero-container">
      <div class="container mx-auto pt-12">
        <LandingPage-Header />
        <LandingPage-Hero />
      </div>
      <div class="flex justify-center mt-12">
        <a href="#getting-started" class="scroll-down"><span></span></a>
      </div>
    </section>
    <div class="wave">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#7e57c2"
          fill-opacity="1"
          d="M0,160L80,149.3C160,139,320,117,480,133.3C640,149,800,203,960,208C1120,213,1280,171,1360,149.3L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></path>
      </svg>
    </div>
    <div id="getting-started" class="container mx-auto -mt-12">
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-56">
        <div>
          <LandingPage-ContentText
            title="Get ready in 30 seconds"
            headline="Quick start"
            sub-headline="with ZenTS CLI"
          >
            Create your first <strong>ZenTS</strong> web application in a few seconds with
            <strong>ZenTS CLI</strong>. The CLI comes with all preinstalled dependencies for your
            application, with a ready to use <strong>TypeScript</strong> compiler and a
            <strong>hot-realoading enabled development server</strong> right at your fingertips.
            Check out the Quick Start guide and learn how to develop <em>fast</em>,
            <em>maintainable</em> and simply awesome web applications with <strong>ZenTS</strong>.
          </LandingPage-ContentText>
          <a class="button mt-8" href="/guide/gettingstarted/installation">
            Installation &amp; Setup
          </a>
        </div>
        <div class="flex content-center">
          <LandingPage-Terminal />
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-56">
        <div class="lg:flex hidden content-center">
          <img :src="$withBase('/landingpage/typescript.svg')" />
        </div>
        <div>
          <LandingPage-ContentText
            title="Typed JavaScript at any scale"
            headline="TypeScript"
            sub-headline="at its best"
          >
            <strong>TypeScript</strong> extends &quot;vanilla&quot; JavaScript with types and allows
            you to use the <em>latest ECMAScript features</em>. Writing your application with
            TypeScript means that you can define the shape of an object, which allows TypeScript to
            validate that your code is working correctly. With <strong>ZenTS</strong>, you can
            levarage the straingth of TypeScript and write <em>more elegant source code</em>. And
            the best news is, if you've used JavaScript before, TypeScript will be
            <em>easy to learn</em>. Check out the official TypeScript website for more information.
          </LandingPage-ContentText>
          <a class="button mt-8" href="https://www.typescriptlang.org/" target="_blank">
            TypeScript Website
          </a>
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-56">
        <div>
          <LandingPage-ContentText
            title="Effective Web Application Development"
            headline="MVC Architecture"
            sub-headline="a great architecture to write maintainable code "
          >
            <strong>ZenTS</strong> is a framework which follows the
            <em>model-view-controller (MVC) pattern</em>. It comes with <em>all the tools</em> you
            need to write code, that can be <em>maintained</em> by many developers at the same time.
            Following the MVC pattern, you've a solid ground to build <em>awesome projects</em> your
            users will love. <strong>ZenTS</strong> has an easy to learn controller mechanism with a
            battle tested and lightning fast router and comes with a rock solid ORM out of the box.
            To present your web application appropriatly, <strong>ZenTS</strong> ships with a rich
            and powerful template engine.
          </LandingPage-ContentText>
          <a class="button mt-8" href="/guide/">
            ZenTS Documentation
          </a>
        </div>
        <div class="lg:flex hidden content-center">
          <img :src="$withBase('/landingpage/mvc.svg')" />
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-56">
        <div class="lg:flex hidden content-center">
          <img :src="$withBase('/landingpage/progressive.svg')" />
        </div>
        <div>
          <LandingPage-ContentText
            title="Progressive framework and a rich ecosystem"
            headline="ZenTS, Node.js and TypeScript "
            sub-headline="a perfect ménage à trois"
          >
            A <strong>ZenTS</strong> web application runs inside the
            <strong>Node.js</strong> JavaScript runtime. With <strong>ZenTS</strong> and TypeScript,
            you can take advantage of the <em>latest JavaScript features</em>, it also brings new
            design patterns and solutions to the Node.js. <strong>Node.js</strong> has a huge
            ecosystem, that is suitable to build all kind of
            <em>enterpriese-grade applications</em>. With <strong>ZenTS</strong> and its easy to
            learn and use API, you can make use of all these advantages and build web applications
            <em>quickly</em>.
          </LandingPage-ContentText>
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-56">
        <div>
          <LandingPage-ContentText
            title="Made with 💜 from developers for developers"
            headline="Open Source"
            sub-headline="now and until the end of the universe"
          >
            <strong>ZenTS</strong> is released under the <strong>MIT licence</strong> and the source
            code can be found on Github. Feel free to contribute if you want to help to improve
            <strong>ZenTS</strong> and make it an even better framework. <strong>ZenTS</strong> is
            created by Sascha Habbes (sahachide) and contributors.<br /><br />
            <strong
              ><em
                >Thank you for using ZenTS and keep building awesome web applications.</em
              ></strong
            >
          </LandingPage-ContentText>
          <a class="button mt-8" href="#">
            View source on Github
          </a>
        </div>
        <div class="lg:flex hidden content-center">
          <img :src="$withBase('/landingpage/open_source.svg')" />
        </div>
      </section>
    </div>
    <footer class="flex justify-center items-center">
      ZenTS is licensed under MIT License. Landing page hero illustration designed by
      <a href="https://www.freepik.com/" target="_blank">upklyak / Freepik</a>. Dark/Light Theme
      Switcher Icon by made by
      <a href="https://www.flaticon.com/authors/freepik">Freepik</a>&nbsp;from
      <a href="https://www.flaticon.com/">www.flaticon.com</a>. Illustrations are created by
      <a href="https://undraw.co/" target="_blank">Katerina Limpitsouni</a>.
    </footer>
  </div>
</template>

<script>
export default {
  mounted() {
    let theme = 'dark'

    if (typeof this.$site.themeConfig.defaultTheme !== 'string') {
      theme =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    } else {
      theme = this.$site.themeConfig.defaultTheme
    }

    const cssClass = `theme-${theme}`

    if (!document.body.className.includes(cssClass)) {
      document.body.className += ` ${cssClass}`
    }
    document.getElementsByTagName('html')[0].setAttribute('theme', theme)
  },
}
</script>

<style lang="stylus" scoped>
.landing-page {
  .hero-container {
    position: relative;
    width: 100%;
    background: rgb(247, 169, 168);
    background: linear-gradient(180deg, rgba(105, 112, 232, 1) 0%, rgba(126, 87, 194, 1) 100%);

    .wave {
      z-index: -1;
      position: absolute;
      bottom: -200px;
      left: 0;
      width: 100%;
      height: 200px;
    }
  }

  .scroll-down {
    position: relative;

    span {
      animation: scrollDown 1.5s infinite;
      position: absolute;
      top: 0;
      left: 50%;
      width: 30px;
      height: 50px;
      margin-left: -15px;
      border: 2px solid #fff;
      border-radius: 50px;
      box-sizing: border-box;
    }

    span::before {
      position: absolute;
      top: 10px;
      left: 50%;
      content: '';
      width: 6px;
      height: 6px;
      margin-left: -3px;
      background-color: #fff;
      border-radius: 100%;
      box-sizing: border-box;
    }

    span::after {
      position: absolute;
      bottom: -18px;
      left: 50%;
      width: 18px;
      height: 18px;
      content: '';
      margin-left: -9px;
      border-left: 1px solid #fff;
      border-bottom: 1px solid #fff;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      box-sizing: border-box;
    }
  }
}

@keyframes scrollDown {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: translate(0, 40px);
    opacity: 0;
  }
}
</style>
