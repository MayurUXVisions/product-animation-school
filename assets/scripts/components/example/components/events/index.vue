<template>
  <ul>
    <li v-for="(event, key) in events" :key="key">
      {{ event.name }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    events: {
      type: Array,
      default: () => { return []; }
    }
  }
};
</script>