<template>
  <div class="user-edit__container">
    <h1>编辑个人信息</h1>
    <label class="user-edit__row edit-nickname">
      <span class="user-edit__label edit-nickname__label">昵称：</span>
      <Input class="edit-nickname__input" v-model="nicknameTemp" />
    </label>
    <label class="user-edit__row edit-signature">
      <span class="user-edit__label edit-signature__label">介绍：</span>
      <textarea class="edit-signature__textarea" v-model="signatureTemp">
      </textarea>
    </label>
    <div class="user-edit__row">
      <span class="user-edit__label">性别：</span>
      <label class="gender-edit__label">
        <input type="radio" name="gender" value="0" v-model="genderTemp" />
        保密
      </label>
      <label class="gender-edit__label">
        <input type="radio" name="gender" value="1" v-model="genderTemp" />
        男
      </label>
      <label class="gender-edit__label">
        <input type="radio" name="gender" value="2" v-model="genderTemp" />
        女
      </label>
    </div>
    <div class="user-edit__row">
      <span class="user-edit__label">生日：</span>
      <!-- year select -->
      <Select
        class="user-edit__year"
        v-model="yearTemp"
        :options="yearOptions"
      />
      <!-- month select -->
      <Select
        class="user-edit__month"
        v-model="monthTemp"
        :options="monthOptions"
      />
      <!-- date select -->
      <Select
        class="user-edit__date"
        v-model="dateTemp"
        :options="dateOptions"
      />
    </div>
    <div class="user-edit__row">
      <span class="user-edit__label">省市：</span>
      <!-- province select -->
      <Select
        class="user-edit__province"
        top
        v-model="provinceTemp"
        :options="provinceOptions"
      />
      <!-- city select -->
      <Select
        class="user-edit__city"
        top
        v-model="cityTemp"
        :options="cityOptions"
      />
    </div>
    <div class="user-edit__save-canel-btn">
      <Button
        class="user-edit__save-btn"
        primary
        @click.native="handleSave"
        :disabled="isNotChange || isSaving"
        >保存</Button
      >
      <Button class="user-edit__cancel-btn" @click.native="handleCancel"
        >取消</Button
      >
    </div>
    <ErrorLabel class="user-edit__save-error" :show="isSaveError">{{
      errorMsg
    }}</ErrorLabel>
    <ErrorLabel class="user-edit__save-success" :show="isSaveSuccess">{{
      successMsg
    }}</ErrorLabel>
  </div>
</template>

<script>
import Input from "@/components/globals/Input";
import Button from "@/components/globals/Button";
import { mapState, mapActions } from "vuex";
import { userUpdate, getUserDetail } from "@/service";
import provinceCitys from "./provinceCitys.json";
import ErrorLabel from "@/components/globals/ErrorLabel";
import Select from "@/components/globals/Select";

export default {
  name: "UserEdit",
  data() {
    return {
      currentUser: null,
      nicknameTemp: null,
      signatureTemp: null,
      genderTemp: null,
      provinceTemp: null,
      cityTemp: null,
      yearTemp: null,
      monthTemp: null, // start from 1
      dateTemp: null,
      yearOptions: [],
      monthOptions: [],
      provinceOptions: provinceCitys.map(p => ({
        key: p.code,
        value: p.code,
        title: p.name
      })),
      // erro
      isSaveError: false,
      errorMsg: "保存错误",
      isSaveSuccess: false,
      successMsg: "保存成功！",
      isSaving: false
    };
  },
  components: {
    Input,
    Button,
    ErrorLabel,
    Select
  },
  computed: {
    ...mapState("currentUser", {
      currentUserId: state => state.userId
    }),
    // get days arry in the specify year and month
    dateOptions() {
      if (this.yearTemp && this.monthTemp) {
        const oneDay = 24 * 60 * 60 * 1000;
        const currentMonth = Date.UTC(this.yearTemp, this.monthTemp);
        const nextMonth = Date.UTC(this.yearTemp, this.monthTemp + 1);
        const dateCount = (nextMonth - currentMonth) / oneDay;
        return new Array(dateCount).fill(true).map((_, idx) => ({
          key: idx,
          value: idx + 1,
          title: `${idx + 1}日`
        }));
      }
      return [];
    },
    isNotChange() {
      if (!this.currentUser) return true;
      const {
        nickname,
        signature,
        gender,
        birthday,
        province,
        city
      } = this.currentUser;
      const d = new Date(birthday);
      return (
        this.nicknameTemp == nickname &&
        this.signatureTemp == signature &&
        this.genderTemp == gender &&
        this.yearTemp == d.getFullYear() &&
        this.monthTemp == d.getMonth() + 1 &&
        this.dateTemp == d.getDate() &&
        this.provinceTemp == province &&
        this.cityTemp == city
      );
    },
    // get citys of the selected province
    cityOptions() {
      const province = provinceCitys.find(p => p.code == this.provinceTemp);
      return province && province.children
        ? province.children.map(c => ({
            key: c.code,
            value: c.code,
            title: c.name
          }))
        : [];
    }
  },
  methods: {
    handleSave() {
      this.isSaving = true;
      const birthday = Date.UTC(this.yearTemp, this.monthTemp - 1);
      userUpdate(
        this.nicknameTemp,
        this.signatureTemp,
        this.genderTemp,
        birthday,
        this.provinceTemp,
        this.cityTemp
      ).then(
        res => {
          this.isSaving = false;
          this.isSaveSuccess = true;
          setTimeout(() => {
            this.isSaveSuccess = false;
          }, 1000);
          this.currentUser = Object.assign(this.currentUser, {
            nickname: this.nicknameTemp,
            signature: this.signatureTemp,
            gender: this.genderTemp,
            birthday,
            province: this.provinceTemp,
            city: this.cityTemp
          });
        },
        error => {
          this.isSaving = false;
          this.isSaveError = true;
          if (error.msg) {
            this.errorMsg = error.msg;
          }
        }
      );
    },
    handleCancel() {
      this.$router.back();
    },
    mapCurrentUserToTemp() {
      if (!this.currentUser) return;
      const {
        nickname,
        signature,
        gender,
        birthday,
        province,
        city
      } = this.currentUser;
      (this.nicknameTemp = nickname),
        (this.signatureTemp = signature),
        (this.genderTemp = gender),
        (this.birthdayTemp = birthday);
      this.provinceTemp = province;
      this.cityTemp = city;

      const d = new Date(birthday);
      this.yearTemp = d.getFullYear();
      this.monthTemp = d.getMonth() + 1;
      this.dateTemp = d.getDate();
    },
    getCurrentUser() {
      const userId = this.$route.params.id;
      console.log("this.currentUserId", userId);
      getUserDetail(userId).then(
        res => {
          this.currentUser = res.data.profile;
        },
        error => {
          this.isSaveError = true;
          if (error && error.msg) {
            this.errorMsg = error.msg;
          } else {
            this.errorMsg = "获取用户详情错误";
          }
        }
      );
    }
  },
  created() {
    this.getCurrentUser();
    this.yearOptions = [];
    for (let i = 1920; i <= new Date().getFullYear(); i++) {
      this.yearOptions.push({ key: i, value: i, title: `${i}年` });
    }
    this.monthOptions = [];
    for (let i = 1; i <= 12; i++) {
      this.monthOptions.push({ key: i, value: i, title: `${i}月` });
    }
  },
  watch: {
    cityOptions(newVal, oldVal) {
      this.cityTemp = this.cityOptions && this.cityOptions[0].value;
    },
    currentUser() {
      this.mapCurrentUserToTemp();
    }
  }
};
</script>

<style lang="sass" scoped>
.user-edit__container
  padding: 2em
  max-width: 50vh
.user-edit__row
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
  margin-top: 2em
.user-edit__label
  flex: 0 0 auto
  margin-right: 1em

// nickname
.edit-nickname

  .edit-nickname__label

// signature
.edit-signature
  align-items: flex-start
.edit-signature__textarea
  font-size: 14px
  flex: 1 1 auto
  resize: none
  height: 10em

// gender
.gender-edit__label
  margin-right: 0.5em
  vertical-align: middle

// birthday
.user-edit__year,
.user-edit__month,
.user-edit__date
  margin-right: 1em

// province city
.user-edit__province
  margin-right: 1em

// save and cancel button
.user-edit__save-canel-btn
  margin-top: 2em
.user-edit__save-btn
  margin-right: 1em

.user-edit__save-error
  margin-top: 2em
.user-edit__save-success
  margin-top: 2em
</style>
