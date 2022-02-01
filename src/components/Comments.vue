<template>
  <div v-cloak id="comments">
    <div v-if="user && user.username">
      <p>Logged in as user {{ user.username }}</p>
      <button v-on:click.prevent="logout">Logout</button>
      <h1>Latest comments</h1>
      <table v-if="items" style="width: 25%; margin-left: auto; margin-right: auto;">
        <tr>
          <th>timestamp</th>
          <th>name</th>
          <th>message</th>
        </tr>
        <tr v-for="item in items" :key="item">
          <td>{{formatDate(item.date)}}</td>
          <td>{{item.name}}</td>
          <td>{{item.message}}</td>
        </tr>
      </table>
      <h1>New entry</h1>
      <form>
        <label for="name">My name</label><br>
        <input id="name" ref="name" style="width:200px;"/>
        <br><br>
        <label for="message">My message</label><br>
        <textarea id="message" ref="message" style="width:500px; height:200px;"></textarea>
        <br><br>
        <button v-on:click.prevent="postData">Submit</button>
      </form>
      <p v-if="error">Error: {{ error }}</p>
    </div>
  </div>
</template>

<script>
  const API_URL = "https://6qt340l8p3.execute-api.eu-central-1.amazonaws.com";
  import Amplify from 'aws-amplify';
  export default {
    el: '#comments',
    name: 'Comments',
    data () {
      return {
        user: null,
        items: null,
        error: null
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
          const res = await fetch(API_URL);

          if (!res.ok) {
            const message = `An error has occured: ${res.status} - ${res.statusText}`;
            throw new Error(message);
          }

          const data = await res.json();

          const result = {
            status: res.status + "-" + res.statusText,
            data: data,
          };
          this.items = this.getSortedItemsFromResult(result);
        } catch (err) {
          this.error = err.message;
        }
      },
      async postData() {
        const postData = {
          name: this.$refs.name.value,
          message: this.$refs.message.value,
        };

        try {
          const res = await fetch(API_URL, {
            method: "post",
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
        this.user = await Amplify.Auth.currentAuthenticatedUser();
      },
      async logout() {
        await Amplify.Auth.signOut();
      }
    }
  }
</script>

<style>
  table, th, td {
    border: 1px solid black;
  };
  [v-cloak] {
    display: none;
  }
</style>