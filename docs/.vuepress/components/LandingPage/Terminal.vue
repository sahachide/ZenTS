<template>
  <div class="window">
    <div class="icons"><span></span></div>
    <div class="title font-nunito-bold">Quick Start</div>
    <div class="text">
      <div>
        <span>npm</span> i zents-cli -g<br />
        <span>zen</span> create myproject<br />
        <span>cd</span> myproject && <span>zen</span> dev
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.window {
  background: #ddd;
  border-radius: 10px;
  display: flex;
  flex-flow: row wrap;
  position: relative;
  width: 100%;
  height: 350px;

  .title {
    flex: 1;
    text-align: center;
    padding: 0.75em;
    color: $textColor;
  }

  .icons {
    padding: 0.75em;
    position: absolute;
  }

  .icons span {
    background: #f4c025;
  }

  .icons:before {
    content: '';
    background: #e4514f;
  }

  .icons:after {
    content: '';
    background: #3ec930;
  }

  .icons span, .icons:before, .icons:after {
    display: inline-block;
    float: left;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    margin-right: 0.5em;
  }

  .text {
    background: #222;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    color: #fff;
    padding: 2.5em;
    width: 100%;
    height: 305px;
  }

  .text > div {
    font: bold 1em / 1.75 'Source Code Pro', monospace;

    > span {
      color: $accentColor;
    }
  }

  .text > div:after {
    animation: blink 0.9s infinite;
    font: initial;
    display: block;
    opacity: 1;
    content: '▋';
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@media (max-width: 800px) {
  pre {
    font-size: 10px;
  }
}
</style>
