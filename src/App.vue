<template>
  <div id="app">
    <app-header :user="user"></app-header>
    <user-comments :user="user"/>
  </div>
</template>

<script>
import UserComments from './components/UserComments.vue';
import AppHeader from './components/AppHeader.vue';
import Amplify from "aws-amplify";

export default {
  name: 'App',
  components: {
    AppHeader,
    UserComments
  },
  data() {
    return {
      user: null
    }
  },
  mounted() {
    this.login();
    this.getUser();
  },
  methods: {
    async login() {
      try {
        await Amplify.Auth.currentAuthenticatedUser();
      } catch (e) {
        await Amplify.Auth.federatedSignIn();
      }
    },
    async getUser() {
      try {
        this.user = await Amplify.Auth.currentAuthenticatedUser();
      } catch (e) {
        this.user = {username: 'Not logged in'};
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
