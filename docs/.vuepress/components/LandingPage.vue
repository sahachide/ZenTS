<template>
  <div class="landing-page">
    <fixed-header :threshold="125">
      <header>
        <div class="header-area header-transparent">
          <div class="main-header">
            <div class="header-bottom header-sticky sticky-bar">
              <div class="container-fluid">
                <div class="row align-items-center">
                  <div class="col-sm-2">
                    <div class="logo">
                      <a href="/">
                        <img src="/zents_logo_white.png" alt="ZenTS" class="zents-logo" />
                      </a>
                    </div>
                  </div>
                  <div class="col-sm-10 d-none d-lg-block">
                    <div class="menu-wrapper d-flex align-items-center justify-content-end">
                      <div class="main-menu">
                        <nav>
                          <ul id="navigation">
                            <li><a href="/">Home</a></li>
                            <li>
                              <a href="/guide/gettingstarted/installation">Getting started</a>
                            </li>
                            <li><a href="/guide">Documentation</a></li>
                            <li><a href="/guide">Guides</a></li>
                          </ul>
                        </nav>
                      </div>
                      <div class="header-right-btn d-none d-lg-block ml-65" style="margin-top: 6px">
                        <a
                          href="https://github.com/sahachide/ZenTS/"
                          target="_blank"
                          class="border-btn"
                        >
                          <vp-icon name="github" class="github-icon" />
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </fixed-header>

    <main>
      <section class="slider-area">
        <div class="slider-active">
          <div class="single-slider slider-height">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-xl-8 col-lg-11 col-md-12">
                  <div class="hero__caption text-center">
                    <h1>Node.js & TypeScript MVC-Framework For Building Rich Web Applications</h1>
                    <p class="hero-text">
                      ZenTS is a open source, modern and fast TypeScript framework
                    </p>
                    <a href="guide/gettingstarted/installation" class="btn hero-btn">
                      Get Started Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="project-screen">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="screen-img">
                <img src="/landingpage/screen.png" alt="ZenTS Screenshot" class="w-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <section class="about-area2 pb-bottom">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-xl-5 col-lg-6 col-md-12">
              <div class="about-caption mb-50">
                <div class="about-icon">
                  <vp-icon name="rocket" color="#ffffff" />
                </div>
                <div class="section-tittle mb-25">
                  <h2>Quick start</h2>
                </div>
                <p class="mb-20">
                  Create your first ZenTS web application in a few seconds with ZenTS CLI. The CLI
                  comes with all preinstalled dependencies for your application, with a ready to use
                  TypeScript compiler and a hot-realoading enabled development server right at your
                  fingertips. Check out the Quick Start guide and learn how to develop fast,
                  maintainable and simply awesome web applications with ZenTS.
                </p>
                <a href="/guide/gettingstarted/installation" class="all-btn"
                  >Installation &amp; Setup</a
                >
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 col-md-12">
              <LandingPage-Terminal />
            </div>
          </div>
        </div>
      </section>

      <section class="our-services">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-xl-7 col-lg-8">
              <div class="section-tittle text-center mb-80">
                <h2>Finally focus on building awesome web applications</h2>
                <p>
                  ZenTS is your swiss army knife for building rich, interactive and maintainable web
                  applications.
                </p>
              </div>
            </div>
          </div>
          <div class="row">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="col-lg-4 col-md-6 col-sm-6"
            >
              <div class="single-services mb-30">
                <div class="services-ion">
                  <vp-icon :name="feature.icon" :color="feature.iconColor" />
                </div>
                <div class="services-cap">
                  <h5>
                    <a :href="feature.link">{{ feature.title }}</a>
                  </h5>
                  <p>
                    {{ feature.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="live-preview section-padding40">
        <div class="section-tittle mb-25">
          <h2>Live preview</h2>
        </div>
        <p class="mb-20">Take a look at how your application maybe will look like.</p>
        <div class="d-flex justify-content-center">
          <div class="sandbox-container">
            <iframe
              src="https://codesandbox.io/embed/zents-example-app-9rk7m?fontsize=14&hidenavigation=1&theme=dark"
              style="width: 100%; height: 500px; border: 0; border-radius: 4px; overflow: hidden"
              title="ZenTS Example App"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>
      </section>

      <section class="about-area2 section-padding40 section-bg2" :style="sectionBackgroundStyle">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-xl-5 col-lg-6 col-md-12">
              <div class="about-caption mb-50">
                <div class="about-icon">
                  <vp-icon name="typescript" color="#ffffff" />
                </div>
                <div class="section-tittle mb-25">
                  <h2>TypeScript at its best</h2>
                </div>
                <p class="mb-20">
                  <strong>TypeScript</strong> extends &quot;vanilla&quot; JavaScript with types and
                  allows you to use the <em>latest ECMAScript features</em>. Writing your
                  application with TypeScript means that you can define the shape of an object,
                  which allows TypeScript to validate that your code is working correctly. With
                  <strong>ZenTS</strong>, you can levarage the straingth of TypeScript and write
                  <em>more elegant source code</em>. And the best news is, if you've used JavaScript
                  before, TypeScript will be <em>easy to learn</em>. Check out the official
                  TypeScript website for more information.
                </p>
                <a href="https://www.typescriptlang.org/" target="_blank" class="all-btn"
                  >TypeScript Website</a
                >
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 col-md-9 col-sm-9">
              <div class="about-img">
                <img :src="$withBase('/landingpage/typescript.svg')" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="about-area2 pb-bottom">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-xl-6 col-lg-5 col-md-9">
              <div class="about-img">
                <img :src="$withBase('/landingpage/mvc.svg')" />
              </div>
            </div>
            <div class="col-xl-5 col-lg-6 col-md-12">
              <div class="about-caption mb-50">
                <div class="about-icon">
                  <vp-icon name="cube" color="#ffffff" />
                </div>
                <div class="section-tittle mb-25">
                  <h2>Effective Web Application Development</h2>
                </div>
                <p class="mb-20">
                  <strong>ZenTS</strong> is a framework which follows the
                  <em>model-view-controller (MVC) pattern</em>. It comes with
                  <em>all the tools</em> you need to write code, that can be <em>maintained</em> by
                  many developers at the same time. Following the MVC pattern, you've a solid ground
                  to build <em>awesome projects</em> your users will love.
                  <strong>ZenTS</strong> has an easy to learn controller mechanism with a battle
                  tested and lightning fast router and comes with a rock solid ORM out of the box.
                  To present your web application appropriatly, <strong>ZenTS</strong> ships with a
                  rich and powerful template engine.
                </p>
                <a href="/guide/" class="all-btn">Documentation</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="about-area2 section-padding40 section-bg2">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-xl-5 col-lg-6 col-md-12">
              <div class="about-caption mb-50">
                <div class="about-icon">
                  <vp-icon name="leaf" color="#ffffff" />
                </div>
                <div class="section-tittle mb-25">
                  <h2>Progressive framework and a rich ecosystem</h2>
                </div>
                <p class="mb-20">
                  A <strong>ZenTS</strong> web application runs inside the
                  <strong>Node.js</strong> JavaScript runtime. With <strong>ZenTS</strong> and
                  TypeScript, you can take advantage of the <em>latest JavaScript features</em>, it
                  also brings new design patterns and solutions to the Node.js.
                  <strong>Node.js</strong> has a huge ecosystem, that is suitable to build all kind
                  of <em>enterpriese-grade applications</em>. With <strong>ZenTS</strong> and its
                  easy to learn and use API, you can make use of all these advantages and build web
                  applications <em>quickly</em>.
                </p>
                <a href="https://www.npmjs.com/package/zents" target="_blank" class="all-btn"
                  >View ZenTS on npm</a
                >
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 col-md-9 col-sm-9">
              <div class="about-img">
                <img :src="$withBase('/landingpage/progressive.svg')" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="wantToWork-area">
        <div class="container">
          <div class="wants-wrapper w-padding2 section-bg2" :style="bottomBackgroundStyle">
            <div class="row align-items-center justify-content-center">
              <div class="col-xl-7 col-lg-9 col-md-8">
                <div class="wantToWork-caption text-center">
                  <h2>Open source made with 💛</h2>
                  <p>
                    <strong>ZenTS</strong> is released under the <strong>MIT licence</strong> and
                    the source code can be found on GitHub.
                  </p>
                  <a
                    href="https://github.com/sahachide/ZenTS/"
                    target="_blank"
                    class="btn3 wantToWork-btn"
                    >GitHub repository</a
                  >
                  <a
                    href="https://www.npmjs.com/package/zents"
                    target="_blank"
                    class="btn3 wantToWork-btn"
                    >NPM package</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer>
      <div class="footer-wrappper section-bg" :style="footerBackgroundStyle">
        <div class="footer-area footer-padding">
          <div class="container">
            <div class="row justify-content-between">
              <div class="col-xl-4 col-lg-5 col-md-4 col-sm-6">
                <div class="single-footer-caption mb-50">
                  <div class="single-footer-caption mb-30">
                    <div class="footer-logo mb-25">
                      <a href="/"
                        ><img src="/zents_logo_white.png" alt="ZenTS" class="zents-logo"
                      /></a>
                    </div>
                    <div class="footer-tittle">
                      <div class="footer-pera">
                        <p>
                          Node.js &amp; TypeScript MVC-Framework For Building Rich Web Applications
                        </p>
                      </div>
                    </div>
                    <div class="footer-social d-flex">
                      <a
                        href="https://github.com/sahachide/ZenTS"
                        target="_blank"
                        class="social-icon"
                        ><vp-icon name="github"
                      /></a>
                      <a
                        href="https://www.npmjs.com/package/zents"
                        target="_blank"
                        class="social-icon"
                        ><vp-icon name="npm"
                      /></a>
                      <a
                        href="https://twitter.com/ZenTS_Framework"
                        target="_blank"
                        class="social-icon"
                        ><vp-icon name="twitter"
                      /></a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-2 col-lg-3 col-md-4 col-sm-5">
                <div class="single-footer-caption mb-50">
                  <div class="footer-tittle">
                    <h4>Guides</h4>
                    <ul>
                      <li><a href="/guide/gettingstarted/installation">Getting started</a></li>
                      <li><a href="/guide/gettingstarted/controllers">Controllers</a></li>
                      <li><a href="/guide/gettingstarted/services">Service Container</a></li>
                      <li>
                        <a href="/guide/gettingstarted/dependency_injection">
                          Dependency Injection
                        </a>
                      </li>
                      <li><a href="/guide/gettingstarted/routing">Routing</a></li>
                      <li><a href="/guide/gettingstarted/database">Database / ORM</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div class="single-footer-caption mb-50">
                  <div class="footer-tittle">
                    <h4>&nbsp;</h4>
                    <ul>
                      <li><a href="/guide/gettingstarted/redis">Redis</a></li>
                      <li>
                        <a href="/guide/gettingstarted/user_management">
                          User &amp; Session Management
                        </a>
                      </li>
                      <li><a href="/guide/gettingstarted/templates">Template Engine</a></li>
                      <li><a href="/guide/gettingstarted/configuration">Configuration</a></li>
                      <li><a href="/guide/gettingstarted/cli">CLI</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-xl-2 col-lg-4 col-md-4 col-sm-6">
                <div class="single-footer-caption mb-50">
                  <div class="footer-tittle">
                    <h4>&nbsp;</h4>
                    <ul>
                      <li>
                        <a href="https://www.npmjs.com/package/zents" target="_blank">
                          <img
                            src="https://img.shields.io/npm/v/zents?style=flat-square&amp;label=Latest%20release%20(ZenTS)"
                            alt="Latest release (CLI)"
                          />
                        </a>
                      </li>
                      <li>
                        <a href="https://www.npmjs.com/package/zents-cli" target="_blank">
                          <img
                            src="https://img.shields.io/npm/v/zents-cli?style=flat-square&amp;label=Latest%20release%20(CLI)"
                            alt="Latest release (CLI)"
                          />
                        </a>
                      </li>
                      <li>
                        <a href="https://github.com/sahachide/ZenTS/issues" target="_blank">
                          <img
                            src="https://img.shields.io/github/issues-raw/sahachide/ZenTS?style=flat-square&amp;label=GitHub%20issues"
                            alt="GitHub issues"
                          />
                        </a>
                      </li>
                      <li>
                        <a href="https://github.com/sahachide/ZenTS/pulls" target="_blank">
                          <img
                            src="https://img.shields.io/github/issues-pr/sahachide/ZenTS?style=flat-square&amp;label=GitHub%20pull%20requests"
                            alt="GitHub pull requests"
                          />
                        </a>
                      </li>
                      <li>
                        <a href="https://github.com/sahachide/ZenTS" target="_blank">
                          <img
                            src="https://img.shields.io/github/languages/code-size/sahachide/ZenTS?style=flat-square&amp;label=Repository%20code%20size"
                            alt="GitHub code size in bytes"
                          />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://github.com/sahachide/ZenTS/blob/master/LICENSE"
                          target="_blank"
                        >
                          <img
                            src="https://img.shields.io/npm/l/zents?style=flat-square&amp;label=License"
                            alt="NPM"
                          />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import FixedHeader from 'vue-fixed-header'

export default {
  components: {
    FixedHeader,
  },
  mounted() {
    document.getElementsByTagName('html')[0].setAttribute('theme', 'light')
  },
  computed: {
    sectionBackgroundStyle() {
      return {
        'background-image': `url(${this.$withBase('/landingpage/section-bg3.png')})`,
      }
    },
    bottomBackgroundStyle() {
      return {
        'background-image': `url(${this.$withBase('/landingpage/section_bg02.png')})`,
      }
    },
    footerBackgroundStyle() {
      return {
        'background-image': `url(${this.$withBase('/landingpage/footer-bg.png')})`,
      }
    },
  },
  data() {
    return {
      features: [
        {
          title: 'Controller & Routing',
          text:
            'Super fast and easy to maintain routing system with simple to use controller architecture.',
          icon: 'controller_routing',
          iconColor: '#1785fc',
          link: '/guide/advancedguides/controllers',
        },
        {
          title: 'Dependency Injection',
          text:
            'Over are the times of over complicated object initialization. All tools ready at your fingertips to build SOLID applications.',
          icon: 'dependency_injection',
          iconColor: '#ff4500',
          link: '/guide/advancedguides/dependency_injection',
        },
        {
          title: 'Service Container',
          text: 'Flexible service container system that helps you to write reusable code.',
          icon: 'services',
          iconColor: '#bb0c0c',
          link: '/guide/advancedguides/services',
        },
        {
          title: 'Autoloading',
          text:
            'Never handle a list of project files somewhere, because ZenTS will load all your project files automatically.',
          icon: 'autoloading',
          iconColor: '#ff8851',
          link: '/guide',
        },
        {
          title: 'ORM & Redis',
          text:
            'Supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, MongoDB and Redis out-of-the-box.',
          icon: 'orm',
          iconColor: '#ffbf00',
          link: '/guide/advancedguides/database',
        },
        {
          title: 'Template Engine',
          text: 'An (optional) battle tested template engine for rendering server side HTML.',
          icon: 'template',
          iconColor: '#00e868',
          link: '/guide/advancedguides/templates',
        },
      ],
    }
  },
}
</script>

<style lang="stylus" scoped>
.landing-page {
  .vue-fixed-header--isFixed {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 999;

    .header-sticky.sticky-bar {
      background: #404dff;
    }
    .header-sticky.sticky-bar.sticky .main-menu ul li a {
      padding: 20px 20px !important;
    }
    @media only screen and (min-width: 768px) and (max-width: 991px) {
      .header-sticky.sticky-bar.sticky {
        padding: 15px 0px;
      }
    }
    @media only screen and (min-width: 576px) and (max-width: 767px) {
      .header-sticky.sticky-bar.sticky {
        padding: 15px 0px;
      }
    }
    @media (max-width: 575px) {
      .header-sticky.sticky-bar.sticky {
        padding: 15px 0px;
      }
    }

  }

 .zents-logo {
   height: 50px;
  }

  .live-preview  {
    text-align: center;
    background-color: #0f0f0f

    h2,
    p {
      color: #f2f2f2 !important
    }

    h2 {
      border-bottom: 0px;
    }

    .sandbox-container {
      width: 80%
    }
  }

 .github-icon {
   float: left;
   margin-top: 2px;
   margin-right: 4px;
  }

  .about-icon,
  .services-ion,
  .social-icon {
    display: flex;
    justify-content: center;

    svg {
      width: 40px;
      height: 40px;
      display: block;
      margin: auto
    }
  }

  .social-icon svg {
    width: 20px;
    height: 20px;
  }

    @media (max-width: 767px) {
    .hero-text {
      display: none;
    }
    .live-preview {
      display: none
    }
  }
}
</style>
