<template>
  <div class="container" id="comments">
    <div v-if="loggedIn">
      <div v-if="isAdmin">Welcome to the Admin page, {{ this.user.username }}</div>
      <div v-else>You are not allowed to access this page!</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AdminView',
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
