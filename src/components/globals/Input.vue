<template>
  <input
    class="input-container"
    :type="type"
    :class="{ 'input-large': large }"
    :placeholder="placeholder"
    :value="value"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    type: String,
    large: Boolean,
    placeholder: String,
    value: String
  },
  model: {
    prop: "value",
    event: "input"
  }
};
</script>

<style lang="sass" scoped>
.input-container
  font-size: 14px;
  display: block;
  width: 100%;
  padding: 0.4em 0.8em;
  border: 1px solid #eee;
  box-sizing: border-box;
  transition: all 250ms;
  &:focus
    outline: none;
    border-color: #777;
  &.input-large
    font-size: 16px;
</style>
