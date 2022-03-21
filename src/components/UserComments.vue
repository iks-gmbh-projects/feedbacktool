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
import Amplify from 'aws-amplify';

export default {
  name: 'UserComments',
  props: {
    user: Object
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
      return this.user && this.user.username;
    }
  },
  methods: {
    formatDate(unformattedDate) {
      var date = new Date(unformattedDate);
      var year = date.getFullYear();
      var month = this.fillToAtLeastTwoDigits(date.getMonth() + 1);
      var dayOfMonth = this.fillToAtLeastTwoDigits(date.getDate());
      var hours = this.fillToAtLeastTwoDigits(date.getHours());
      var minutes = this.fillToAtLeastTwoDigits(date.getMinutes());
      var seconds = this.fillToAtLeastTwoDigits(date.getSeconds());
      var millis = this.fillToAtLeastTwoDigits(date.getMilliseconds());
      return year + "-" + month + "-" + dayOfMonth + " " + hours + ":" + minutes + ":" + seconds + "." + millis;
    },
    fillToAtLeastTwoDigits(str) {
      var result = str;
      while (("" + result).length < 2) {
        result = "0" + result;
      }
      return result;
    },
    getSortedItemsFromResult(result) {
      return result.data.Items.sort((a, b) => a.date < b.date && 1 || -1);
    },
    async getAllData() {
      try {
        const session = await Amplify.Auth.currentSession();
        const token = session.idToken.jwtToken;

        const res = await fetch(this.$apiUrl, {
          method: "get",
          headers: {
            "Authorization": token
          }
        });

        if (!res.ok) {
          const message = `An error has occurred: ${res.status} - ${res.statusText}`;
          throw new Error(message);
        }

        const data = await res.json();

        const result = {
          status: res.status + "-" + res.statusText,
          data: data,
        };
        this.messages = this.getSortedItemsFromResult(result);
      } catch (err) {
        this.error = err.message;
      }
    },
    async postData() {
      const postData = {
        username: this.user.username,
        name: this.name,
        message: this.newMessage
      };

      try {
        const session = await Amplify.Auth.currentSession();
        const token = session.idToken.jwtToken;

        const res = await fetch(this.$apiUrl, {
          method: "post",
          headers: {
            "Authorization": token
          },
          body: JSON.stringify(postData)
        });

        if (!res.ok) {
          const msg = `An error has occurred: ${res.status} - ${res.statusText}`;
          throw new Error(msg);
        }

        await res.json();

        await this.getAllData();
      } catch (err) {
        this.error = err.message;
      }
    }
  }
}
</script>

<style>
</style>
