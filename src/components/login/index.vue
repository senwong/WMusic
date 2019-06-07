<template>
  <div class="login">
    <div class="login__type">
      <Button
        class="login__type__email"
        block
        rounded
        large
        :primary="isEmail"
        @click.native="switchToEmail"
        >邮箱登录</Button
      >
      <Button
        class="login__type__phone"
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
      class="login__email"
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
    <div class="login__phone" v-if="isPhone">
      <Select
        :options="phoneOptions"
        v-model="phoneCountryCode"
        :optionValueToTitle="val => `+${val}`"
        class="login__phone__country-code"
      />
      <Input
        class="login__phone__number"
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
      class="login__password"
      type="password"
      large
      placeholder="密码"
      v-model="password"
      @enter="handleLogin"
      @focus.native="handlePasswordFocus"
    />
    <div
      class="login__failed"
      :class="{ 'login__failed--show': isLoginFailed }"
    >
      登录错误，请重试。
    </div>
    <Button
      class="login__submit"
      block
      primary
      large
      @click.native="handleLogin"
      >登录</Button
    >

    <div class="login__signup">
      <div class="login__signup__title">没有账号</div>
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
import Select from "@/components/globals/Select.vue";
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
  components: { Button, Input, Select }
})
export default class Login extends Vue {
  email: string = "";
  password: string = "";
  isLoginFailed: boolean = false;
  type: LoginType = LoginType.Email;
  phoneCountryCode: number = 86;
  phoneNumber: number | null = null;

  get phoneOptions(): Option[] {
    return CountryPhoneCodes.map((pc, idx) => ({
      key: idx,
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
  handlePhoneLogin() {
    if (this.phoneNumber === null || this.phoneCountryCode === null) {
      return;
    }
    if (
      this.verifyPhoneLogin(
        this.phoneNumber,
        this.password,
        this.phoneCountryCode
      )
    ) {
      this.handleLoginResponsePromsie(
        loginPhone(this.phoneNumber, this.password, this.phoneCountryCode)
      );
    }
  }
  handleEmailLogin() {
    if (this.verifyEmailLogin(this.email, this.password)) {
      this.handleLoginResponsePromsie(loginEmail(this.email, this.password));
    }
  }
  handleLogin() {
    if (this.isPhone) {
      this.handlePhoneLogin();
    } else {
      this.handleEmailLogin();
    }
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
.login
  width: 500px
  margin: 20vh auto
  &__type
    display: flex
    flex-direction: row
    justify-content: stretch
    &__email
      flex: 1 1 auto
      margin-right: 60px
    &__phone
      flex: 1 1 auto
  &__email, &__password
    margin-top: 1em
  &__phone
    margin-top: 1em
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
    &__country-code
      flex: 0 0 auto
    &__number
      flex: 1 1 auto
      margin-left: 1em
  &__failed
    font-size: 14px
    color: red
    text-align: center
    margin-top: 30px
    opacity: 0
    transition: all 250ms
    &--show
      opacity: 1
  &__submit
    margin-top: 10px

  &__signup
    margin-top: 100px
    text-align: center
    &__title
      margin-bottom: 6px
      font-size: 14px
      color: #777
</style>
