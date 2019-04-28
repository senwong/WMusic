<template>
  <div class="phone-input__container">
    <Input type="phone" placeholder="手机号码" class="phone-input__input" v-model="phoneNumber" />
    <select class="phone-input__select" v-model="countryCode">
      <option
        v-for="(p, idx) in CountryPhoneCodes"
        :key="idx"
        :value="p.phoneCode"
      >
        +{{p.phoneCode}}({{p.countryName}})
      </option>
    </select>
  </div>
</template>
<script>
import Input from '@/components/globals/Input';
import CountryPhoneCodes from './CountryPhoneCodes.json';

export default {
  components: { Input },
  data() {
    return {
      CountryPhoneCodes,
      phoneNumber: null,
      countryCode: null,
    }
  },
  created() {
    this.phoneNumber = this.phone.number;
    this.countryCode = this.phone.countryCode;
  },
  watch: {
    phoneNumber() {
      this.emitData();
    },
    countryCode() {
      this.emitData();
    }
  },
  props: {
    phone: {
      type: Object,
      required: true,
    },
  },
  model: {
    prop: 'phone',
    event: 'change',
  },
  methods: {
    emitData() {
      this.$emit('change', {
        number: this.phoneNumber,
        countryCode: this.countryCode,
      });
    }
  }
}
</script>
<style lang="sass" scoped>
.phone-input__container
  position: relative;
.phone-input__input
  padding-left: 5em;
.phone-input__select
  position: absolute;
  display: block;
  left: 0;
  top: 0;
  width: 5em;
  height: 100%;
  border: none;
  border-radius: 0;
  font-size: 14px;
  &:focus
    outline: none;
</style>

