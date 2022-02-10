<template>
  <div class="container" v-cloak id="comments">
    <div v-if="user && user.username">
      <div class="row">
        <div class="col">
          <div class="float-end">
            <img src="@/assets/img/person.svg" alt="Person">
            <span class="me-3">{{ user.username }}</span>
            <button class="btn btn-sm btn-outline-secondary" @click.prevent="logout">Logout</button>
          </div>
        </div>
      </div>
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
                <td>{{formatDate(message.date)}}</td>
                <td>{{message.name}}</td>
                <td>{{message.message}}</td>
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
    name: 'Comments',
    data () {
      return {
        user: null,
        messages: null,
        error: null,
        name: "",
        newMessage: ""
      }
    },
    created: function() {
      this.login();
      this.showUser();
      this.getAllData();
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
        while ((""+result).length < 2) {
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
            const message = `An error has occured: ${res.status} - ${res.statusText}`;
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
            const msg = `An error has occured: ${res.status} - ${res.statusText}`;
            throw new Error(msg);
          }

          await res.json();

          this.getAllData();
        } catch (err) {
          this.error = err.message;
        }
      },
      async login() {
        try {
          await Amplify.Auth.currentAuthenticatedUser();
        } catch (e) {
          await Amplify.Auth.federatedSignIn();
        }
      },
      async showUser() {
        try {
          this.user = await Amplify.Auth.currentAuthenticatedUser();
        } catch (e) {
          this.user = { username: 'Not logged in' };
        }
      },
      async logout() {
        await Amplify.Auth.signOut();
      }
    }
  }
</script>

<style>
  [v-cloak] {
    display: none;
  }
</style>
