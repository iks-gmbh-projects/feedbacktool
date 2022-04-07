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
    user: Object
  },
  data() {
    return {
    }
  },
  created: function () {
  },
  computed: {
    loggedIn() {
      return this.user && this.user.username;
    },
    isAdmin() {
      const userGroups = this.user.signInUserSession.accessToken.payload["cognito:groups"];
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
