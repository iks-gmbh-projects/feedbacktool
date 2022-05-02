<template>
  <div class="container" id="comments">
    <div v-if="loggedIn">
      <div class="row">
        <div class="col">
          <h1>New message</h1>
        </div>
      </div>
      <form class="mb-5">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label><br>
          <input id="name" class="form-control" v-model="name"/>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">My message</label><br>
          <textarea id="message" class="form-control" v-model="newMessage"></textarea>
        </div>

        <button class="btn btn-primary" @click.prevent="postData">Submit message</button>
        <p v-if="error">Error: {{ error }}</p>
      </form>

      <div class="row" v-if="messages">
        <div class="col">
          <h1>Last submitted messages</h1>
        </div>
      </div>
      <div class="row" v-if="messages">
        <div class="col">
          <table class="table table-striped">
            <thead>
            <tr>
              <th scope="col">timestamp</th>
              <th scope="col">name</th>
              <th scope="col">message</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="message in messages" :key="message.date">
              <td>{{ formatDate(message.date) }}</td>
              <td>{{ message.name }}</td>
              <td>{{ message.message }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { getFromApi, postToApi } from '../common/http-service.js';

export default {
  name: 'UserComments',
  props: {
    loggedInUser: Object
  },
  data() {
    return {
      messages: null,
      error: null,
      name: "",
      newMessage: ""
    }
  },
  created: function () {
    this.getAllData();
  },
  computed: {
    loggedIn() {
      return this.loggedInUser && this.loggedInUser.username;
    }
  },
  methods: {
    formatDate(dateNumeric) {
      return format(new Date(dateNumeric), 'dd.MM.yyyy HH:mm:ss.SSS');
    },
    getSortedItemsFromResult(result) {
      return result.data.Items.sort((a, b) => a.date < b.date && 1 || -1);
    },
    async getAllData() {
      var result = await getFromApi(this.$commentsApiUrl);
      if (result.error != null) {
        this.error = result.error;
      } else {
        this.messages = this.getSortedItemsFromResult(result);
      }
    },
    async postData() {
      const data = {
        username: this.loggedInUser.username,
        name: this.name,
        message: this.newMessage
      };
      var result = await postToApi(this.$commentsApiUrl, data);
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
