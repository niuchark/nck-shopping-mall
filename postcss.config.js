// postcss.config.js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      // vw适配的标准屏幕宽度，以iphoneX为例，375px
      // 设计图750px，调成1倍，适配375px标准屏幕
      // 设计图640px，调成1倍，适配320px标准屏幕
      viewportWidth: 375
    }
  }
}
