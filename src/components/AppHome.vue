<template>
  <div class="container" id="home">
    <div v-if="loggedIn">
      <h1>My events</h1>
      <div class="row" v-if="this.events != null && isLoggedInUserAssignedToAnyEvent()">
        <div class="col">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">name</th>
                <th scope="col">date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in events" :key="event.date">
                <td v-if="isLoggedInUserAssignedToEvent(event)"><router-link :to="`/comments?event=${event.name}`">{{ event.name }}</router-link></td>
                <td v-if="isLoggedInUserAssignedToEvent(event)">{{ formatDate(event.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="this.events != null && !isLoggedInUserAssignedToAnyEvent()">You are currently not assigned to any events!</div>
      <div v-if="isAdmin"><br><router-link to="/admin">Go to Admin view</router-link></div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { getFromApi } from '../common/http-service.js';

export default {
  name: 'AppHome',
  props: {
    loggedInUser: Object
  },
  data() {
    return {
      events: null,
      eventsApiError: null
    }
  },
  created: function () {
    this.getAllEvents();
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
    formatDate(dateString) {
      return format(Date.parse(dateString), 'dd.MM.yyyy');
    },
    getSortedEventItemsFromResult(result) {
      return result.data.Items.sort((a, b) => a.date < b.date && 1 || -1);
    },
    isLoggedInUserAssignedToEvent(event) {
      if (event == null || event.users == null) {
        return false;
      }
      for (let i = 0; i < event.users.length; i++) {
        if (event.users[i].name === this.loggedInUser.username) {
          return true;
        }
      }
      return false;
    },
    isLoggedInUserAssignedToAnyEvent() {
      if (this.events == null) {
        return false;
      }
      for (let i = 0; i < this.events.length; i++) {
        if (this.isLoggedInUserAssignedToEvent(this.events[i])) {
          return true;
        }
      }
      return false;
    },
    async getAllEvents() {
      var result = await getFromApi(this.$eventsApiUrl);
      if (result.error != null) {
        this.eventsApiError = result.error;
      } else {
        this.events = this.getSortedEventItemsFromResult(result);
      }
    },
  }
}
</script>

<style>
</style>
