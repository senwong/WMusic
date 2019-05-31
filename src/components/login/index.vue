<template>
  <div class="page__container">
    <div class="login-type__container">
      <Button
        class="login-type__email"
        block
        rounded
        large
        :primary="isEmail"
        @click.native="switchToEmail"
        >邮箱登录</Button
      >
      <Button
        class="login-type__phone"
        block
        rounded
        large
        :primary="isPhone"
        @click.native="switchToPhone"
        >手机登录</Button
      >
    </div>
    <!-- 使用邮箱登录 -->
    <Input
      v-if="isEmail"
      class="input-email"
      type="text"
      large
      placeholder="邮箱地址"
      v-model="email"
      @change="handleEmailChange"
      @focus.native="handleEmailFocus"
      :verify="verifyEmail"
      @enter="handleLogin"
    />
    <!-- 使用手机登录 -->
    <div class="phone-input" v-if="isPhone">
      <SelectInput
        class="phone-input__country-code"
        :options="phoneOptions"
        v-model="phoneCountryCode"
        :optionToTitle="optionToTitle"
      />
      <Input
        class="phone-input__phone-number"
        type="text"
        large
        placeholder="手机号码"
        v-model="phoneNumber"
        @enter="handleLogin"
        @focus.native="handleEmailFocus"
      />
    </div>
    <!-- 密码 -->
    <Input
      class="input-password"
      type="password"
      large
      placeholder="密码"
      v-model="password"
      @enter="handleLogin"
      @focus.native="handlePasswordFocus"
    />
    <div class="login-failed" :class="{ 'login-failed_show': isLoginFailed }">
      登录错误，请重试。
    </div>
    <Button class="login-btn" block primary large @click.native="handleLogin"
      >登录</Button
    >

    <div class="signup__container">
      <div class="signup__title">没有账号</div>
      <Button block large>注册</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";
import Button from "@/components/globals/Button.vue";
import Input from "@/components/globals/Input.vue";
import { loginEmail, loginPhone } from "@/service";
import SelectInput from "@/components/globals/SelectInput.vue";
import CountryPhoneCodes from "./CountryPhoneCodes.json";
import { Option } from "@/types";

enum LoginType {
  Email,
  Phone
}
type Phone = {
  countryCode: number;
  number: number;
};
const emailRE = /^\w+[\w-.]*\w+@\w+\.\w+$/;

const currentUser = namespace("currentUser");

@Component({
  components: { Button, Input, SelectInput }
})
export default class Login extends Vue {
  email: string = "";
  password: string = "";
  isLoginFailed: boolean = false;
  type: LoginType = LoginType.Email;
  phoneCountryCode: Option | null = null;
  phoneNumber: number | null = null;

  get phoneOptions(): Option[] {
    return CountryPhoneCodes.map((pc, idx) => ({
      id: idx,
      title: `+${pc.phoneCode}(${pc.countryName})`,
      value: pc.phoneCode
    }));
  }
  get isPhone(): boolean {
    return this.type === LoginType.Phone;
  }
  get isEmail(): boolean {
    return this.type === LoginType.Email;
  }
  @currentUser.Mutation setCurrentUserId!: (id: number) => void;
  handleLogin() {
    if (this.isPhone) {
      if (
        !this.verifyPhoneLogin(
          this.phoneNumber,
          this.password,
          this.phoneCountryCode && this.phoneCountryCode.value
        )
      ) {
        return;
      }
    }
    if (this.isEmail) {
      if (!this.verifyEmailLogin(this.email, this.password)) {
        return;
      }
    }
    if (this.phoneNumber === null || this.phoneCountryCode === null) {
      return;
    }
    const responsePromise = this.isEmail
      ? loginEmail(this.email, this.password)
      : loginPhone(
          this.phoneNumber,
          this.password,
          this.phoneCountryCode.value
        );
    this.handleLoginResponsePromsie(responsePromise);
  }
  verifyPhoneLogin(
    phoneNumber: number | null,
    password: string,
    phoneCountryCode: number | null
  ): boolean {
    return (
      phoneNumber !== null && password.length > 0 && phoneCountryCode !== null
    );
  }
  verifyEmailLogin(email: string, password: string): boolean {
    if (email === undefined || password === undefined) return false;
    return this.verifyEmail(email) && password.length > 0;
  }
  handleEmailFocus() {
    this.emptyErrorsHint();
  }
  handleEmailChange(e: Event) {
    this.verifyEmail((e.target as HTMLInputElement).value);
  }
  handlePasswordFocus() {
    this.emptyErrorsHint();
  }
  emptyInput() {
    this.email = "";
    this.password = "";
  }
  emptyErrorsHint() {
    this.isLoginFailed = false;
  }
  handleLoginResponsePromsie(responsePromise: Promise<any>) {
    responsePromise.then(
      res => {
        this.setCurrentUserId(res.data.profile.userId);
        this.$router.push("/");
      },
      error => {
        this.isLoginFailed = true;
      }
    );
  }
  switchToEmail() {
    this.type = LoginType.Email;
    this.emptyErrorsHint();
  }
  switchToPhone() {
    this.type = LoginType.Phone;
    this.emptyErrorsHint();
  }

  verifyEmail(email: string) {
    if (email.length < 1) return false;
    return emailRE.test(email);
  }
  optionToTitle(opt: Option): string {
    return `+${opt.value}`;
  }
}
</script>

<style lang="sass" scoped>
.page__container
  width: 500px
  margin: 20vh auto
.login-type__container
  display: flex
  flex-direction: row
  justify-content: stretch
.login-type__email
  flex: 1 1 auto
  margin-right: 60px
.login-type__phone
  flex: 1 1 auto

.input-email, .input-password
  margin-top: 1em

.login-failed
  font-size: 14px
  color: red
  text-align: center
  margin-top: 30px
  opacity: 0
  transition: all 250ms
  &.login-failed_show
    opacity: 1
.login-btn
  margin-top: 10px
.phone-input
  margin-top: 1em
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
.phone-input__country-code
  flex: 0 0 auto
.phone-input__phone-number
  flex: 1 1 auto
  margin-left: 1em

.signup__container
  margin-top: 100px
  text-align: center
.signup__title
  margin-bottom: 6px
  font-size: 14px
  color: #777
</style>
