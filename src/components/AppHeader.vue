<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img id="iks-logo" :src="imgPath.logo" alt="IKS">
      </a>
      <h1 class="me-auto">Feedbacktool</h1>
      <div class="ms-auto" v-if="loggedIn">
        <img :src="imgPath.person" alt="Person">
        <span class="me-3">{{ user.username }}</span>
        <button class="btn btn-sm btn-outline-secondary" @click="logout">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
import Amplify from "aws-amplify";

export default {
  name: "AppHeader",
  props: {
    user: Object
  },
  data() {
    return {
      imgPath: {
        logo: require('@/assets/img/iks-logo.svg'),
        person: require('@/assets/img/person.svg')
      }
    }
  },
  computed: {
    loggedIn() {
      return this.user && this.user.username
    }
  },
  methods: {
    async logout() {
      await Amplify.Auth.signOut();
    }
  }
}

</script>

<style scoped>
#iks-logo {
  height: 75px;
  width: auto;
}
</style>
