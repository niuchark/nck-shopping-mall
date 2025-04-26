<template>
  <div class="login">
    <!-- 头部组件 -->
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <!-- 主体部分 -->
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>
      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img v-if="picUrl" :src="picUrl" alt="" @click="getPicCode" />
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">{{ second === totalSecond ? '获取验证码' : second + '秒后重新发送' }}</button>
        </div>
      </div>

      <div @click="login" class="login-btn">登录</div>
    </div>
  </div>
</template>

<script>
import { getMsgCode, codeLogin, getPicCode } from '@/api/login'
// import { Toast } from 'vant'

export default {
  name: 'LoginPage',
  data () {
    return {
      picKey: '', // 将来请求传递的图形验证码唯一标识
      picUrl: '', // 存储请求渲染的图片地址
      totalSecond: 60, // 倒计时秒数
      second: 60, // 当前剩余秒数
      timer: null, // 定时器id
      mobile: '', // 手机号
      picCode: '', // 图形验证码
      msgCode: '' // 短信验证码
    }
  },
  async created () {
    // 页面创建时的逻辑
    this.getPicCode()// 方法封装到methods中便于后续调用
  },
  methods: {
    async getPicCode () {
      // 发送请求获取图形验证码
      const { data: { base64, key } } = await getPicCode()
      this.picUrl = base64 // 存储地址
      this.picKey = key // 存储唯一标识
      // Toast('获取图形验证码成功')
      // this.$toast.success('获取图形验证码成功')
    },

    // 校验手机号和图形验证码是否合法
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('请输入正确的图形验证码')
        return false
      }
      return true
    },

    // 获取短信验证码
    async getCode () {
      if (!this.validFn()) return // 没通过校验则没必要往下走了
      // 当目前没有定时器开着，且 totalSecond === second 时（秒数归为），才可以开启倒计时
      if (!this.timer && this.second === this.totalSecond) { // 如果定时器存在，直接返回
      // 预期是：希望如果响应的status非200，最好抛出一个promise错误，await只会等待成功的promise
      // 发送请求
        await getMsgCode(this.picCode, this.mobile, this.picKey)
        this.$toast('短信发送成功，注意查收')
        // 开启倒计时
        this.timer = setInterval(() => { // 开启定时器时，定时器id赋值给this.timer
          this.second--

          if (this.second <= 0) { // 如果秒数小于等于0，清除定时器
            clearInterval(this.timer) // 清除定时器
            this.timer = null // 清空定时器id
            this.second = this.totalSecond // 重置秒数
          }
        }, 1000)
      }
    },

    // 登陆
    async login () {
      if (!this.validFn()) return // 校验手机号和图形验证码是否合法

      if (!/^\d{6}$/.test(this.msgCode)) { // 正则校验短信验证码是否合法
        this.$toast.fail('短信验证码不合法') // 提示短信验证码不合法
        return // 不合法
      }
      // 发送请求
      const res = await codeLogin(this.mobile, this.msgCode) // 调用登录接口
      this.$store.commit('user/setUserInfo', res.data) // 将用户信息存储到vuex中
      console.log(res) // 打印返回结果;
      this.$toast.success('登录成功') // 提示登录成功
      // 进行判断，看地址栏有无回跳地址
      // 1. 如果有   => 说明是其他页面，拦截到登录来的，需要回跳
      // 2. 如果没有 => 正常去首页
      const url = this.$route.query.backUrl || '/'
      // push是添加新的路由，replace是替换当前路由
      this.$router.replace(url)
    }
  },
  destroyed () {
    // 页面销毁时的逻辑
    if (this.timer) { // 如果定时器存在，清除定时器
      clearInterval(this.timer) // 清除定时器
      this.timer = null // 清空定时器id
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
