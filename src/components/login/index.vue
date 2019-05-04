<template>
  <div class="page__container">
    <div class="login-type__container">
      <Button
        class="login-type__email"
        block
        rounded
        large
        :primary="type == 'email'"
        @click.native="switchToEmail"
      >邮箱登录</Button>
      <Button
        class="login-type__phone"
        block
        rounded
        large
        :primary="type == 'phone'"
        @click.native="switchToPhone"
      >手机登录</Button>
    </div>
    <!-- 使用邮箱登录 -->
    <Input v-if="type == 'email'"
      class="input-email"
      type="text"
      large
      placeholder="邮箱地址"
      v-model="email"
      @focus.native="handleEmailFocus"
    />
    <!-- 使用手机登录 -->
    <PhoneInput class="input-email" v-if="type == 'phone'" v-model="phone" />
    <!-- 密码 -->
    <Input
      class="input-password"
      type="password"
      large
      placeholder="密码"
      v-model="password"
      @focus.native="handlePasswordFocus"
    />
    <div
      class="login-failed"
      :class="{ 'login-failed_show': isLoginFailed }"
    >登录错误，请重试。</div>
    <Button class="login-btn" block primary large @click.native="handleLogin">登录</Button>

    <div class="signup__container">
      <div class="signup__title">没有账号</div>
      <Button block large>注册</Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/globals/Button';
import Input from '@/components/globals/Input';
import { loginEmail, loginPhone } from '@/service';
import { mapMutations } from 'vuex';
import PhoneInput from './PhoneInput';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      isLoginFailed: false,
      type: 'email',
      phone: {
        countryCode: 86,
        number: null,
      },
    };
  },
  components: { Button, Input, PhoneInput },
  methods: {
    handleLogin() {
      const responsePromise = this.type == 'email'
        ? loginEmail(this.email, this.password)
        : loginPhone(this.phone.number, this.password, this.phone.countryCode);
      this.handleLoginResponsePromsie(responsePromise);
    },
    handleEmailFocus() {
      this.emptyErrorsHint();
    },
    handlePasswordFocus() {
      this.emptyErrorsHint();
    },
    emptyInput() {
      this.email = '';
      this.password = '';
    },
    emptyErrorsHint() {
      this.isLoginFailed = false;
    },
    handleLoginResponsePromsie(responsePromise) {
      responsePromise.then(
        res => {
          console.log('response ', res);
          this.setCurrentUserId(res.data.profile.userId);
          this.$router.push('/');          
        },
        error => {
          this.isLoginFailed = true;    
        }
      );
    },
    switchToEmail() {
      this.type = 'email';
      this.emptyErrorsHint();
    },
    switchToPhone() {
      this.type = 'phone';
      this.emptyErrorsHint();
    },
    ...mapMutations('currentUser', [
      'setCurrentUserId',
    ])
  }
}
</script>

<style lang="sass" scoped>
.page__container
  width: 500px;
  margin: 20vh auto;
.login-type__container
  display: flex;
  flex-direction: row;
  justify-content: stretch;
.login-type__email
  flex: 1 1 auto;
  margin-right: 60px;
.login-type__phone
  flex: 1 1 auto;

.input-email, .input-password
  margin-top: 20px;

.login-failed
  font-size: 14px;
  color: red;
  text-align: center;
  margin-top: 30px;
  opacity: 0;
  transition: all 250ms;
  &.login-failed_show
    opacity: 1;
.login-btn
  margin-top: 10px;


.signup__container
  margin-top: 100px;
  text-align: center;
.signup__title
  margin-bottom: 6px;
  font-size: 14px;
  color: #777;
</style>
