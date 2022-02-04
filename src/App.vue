<template>
  <div id="app">
    <comments/>
  </div>
</template>

<script>
import Comments from './components/Comments.vue'

export default {
  name: 'App',
  components: {
    Comments
  }
}
</script>

<style type="scss">
div#app:after {
  content: url("~@/assets/img/splash-background-cropped.png");
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: -1;
}
</style>
