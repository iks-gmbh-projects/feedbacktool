<template>
  <div class="container" id="comments">
    <div v-if="loggedIn">
      <router-link to="/comments">Read and enter comments</router-link>
      <div v-if="isAdmin"><router-link to="/admin">Go to Admin view</router-link></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AppHome',
  props: {
    loggedInUser: Object
  },
  data() {
    return {
    }
  },
  created: function () {
  },
  computed: {
    loggedIn() {
      return this.loggedInUser && this.loggedInUser.username;
    },
    isAdmin() {
      const userGroups = this.loggedInUser.signInUserSession.accessToken.payload["cognito:groups"];
      if (userGroups != null) {
        return userGroups.includes('admin');
      }
      return false;
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
