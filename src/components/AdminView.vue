<template>
  <div class="container" id="comments">
    <div v-if="loggedIn">
      <div v-if="isAdmin">
        <p>Welcome to the Admin page, {{ this.user.username }}</p>
        <div class="row">
        <div class="col">
          <h1>New event</h1>
        </div>
      </div>
      <form class="mb-5">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label><br>
          <input id="name" class="form-control" v-model="newEventName"/>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">Date</label><br>
          <datepicker v-model="newEventDate" lang="de" format="dd.MM.YYYY" type="date" :lowerLimit="new Date()" />
        </div>

        <button class="btn btn-primary" @click.prevent="postData">Save event</button>
        <p v-if="error">Error: {{ error }}</p>
      </form>

      <div class="row" v-if="events">
        <div class="col">
          <h1>Existing events</h1>
        </div>
      </div>
      <div class="row" v-if="events">
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
              <td>{{ event.name }}</td>
              <td>{{ formatDate(event.date) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
      <div v-else>You are not allowed to access this page!</div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vue3-datepicker';
import { ref } from 'vue';
import { format } from 'date-fns';
import { getFromApi, postToApi } from '../common/http-service.js';

export default {
  name: 'AdminView',
  props: {
    user: Object
  },
  components: {
    Datepicker
  },
  data() {
    return {
      events: null,
      error: null,
      newEventName: "",
      newEventDate: ref(new Date())
    }
  },
  created: function () {
    this.getAllData();
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
    formatDate(dateString) {
      return format(Date.parse(dateString), 'dd.MM.yyyy');
    },
    getSortedItemsFromResult(result) {
      return result.data.Items.sort((a, b) => a.date < b.date && 1 || -1);
    },
    async getAllData() {
      var result = await getFromApi(this.$eventsApiUrl);
      if (result.error != null) {
        this.error = result.error;
      } else {
        this.events = this.getSortedItemsFromResult(result);
      }
    },
    async postData() {
      const data = {
        username: this.user.username,
        name: this.newEventName,
        date: new Date(this.newEventDate)
      };
      var result = await postToApi(this.$eventsApiUrl, data);
      if (result.error != null) {
        this.error = result.error;
      } else {
        await this.getAllData();
      }
    }
  }
}
</script>

<style>
</style>
