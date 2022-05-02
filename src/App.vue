<template>
  <div id="app">
    <app-header :loggedInUser="loggedInUser"/>
    <router-view :loggedInUser="loggedInUser"/>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import Amplify from "aws-amplify";

export default {
  name: 'App',
  components: {
    AppHeader
  },
  data() {
    return {
      loggedInUser: null
    }
  },
  mounted() {
    this.login();
    this.getLoggedInUser();
  },
  methods: {
    async login() {
      try {
        await Amplify.Auth.currentAuthenticatedUser();
      } catch (e) {
        await Amplify.Auth.federatedSignIn();
      }
    },
    async getLoggedInUser() {
      try {
        this.loggedInUser = await Amplify.Auth.currentAuthenticatedUser();
      } catch (e) {
        this.loggedInUser = {username: 'Not logged in'};
      }
    }
  }
}
</script>

<style type="scss">
div#app:after {
  content: url("~@/assets/img/splash-background-cropped.png");
  position: fixed;
  bottom: -7px;
  left: -1px;
  z-index: -1;
}
</style>
