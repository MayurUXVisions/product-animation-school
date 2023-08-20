<template>
  <span class="svg-icon-wrapper">
    <svg v-if="name === 'spinner'" :class="classes" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="shape-rendering: auto;" width="40px" height="40px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <circle cx="50" cy="50" fill="none" stroke="#000" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="600ms" values="0 50 50;360 50 50" keyTimes="0;1" />
      </circle>
    </svg>
  </span>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    classes () {
      return 'svg-icon  svg-icon--' + this.name;
    }
  }
};
</script>
