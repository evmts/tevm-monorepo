<template>
  <div></div>
</template>

<script>
import { onMounted } from 'vue';
import { inject } from '@vercel/analytics';

export default {
  name: 'Analytics',

  setup() {
    onMounted(() => {
      inject();
    });
  },
};
</script>
