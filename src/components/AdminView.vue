<template>
  <div class="container" id="admin">
    <div v-if="loggedIn">
      <div v-if="isAdmin">
        <p>Welcome to the Admin page, {{ this.loggedInUser.username }}</p>

        <!-- Events -->
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

          <button class="btn btn-primary" @click.prevent="postEvent(newEventName, newEventDate, [])">Save event</button>
          <p v-if="eventsApiError">Error: {{ eventsApiError }}</p>
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
                  <th scope="col">users</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in events" :key="event.date">
                  <td>{{ event.name }}</td>
                  <td>{{ formatDate(event.date) }}</td>
                  <td>
                    <tr v-for="user in users" :key="user.name">
                      <td><input type="checkbox" :checked="isUserAssignedToEvent(user, event)" @change="userEventAssignmentChanged($event, user, event)"/>&#32;{{ user.name }}</td>
                    </tr>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Users -->
        <div class="row">
          <div class="col">
            <h1>New user</h1>
          </div>
        </div>
        <form class="mb-5">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label><br>
            <input id="name" class="form-control" v-model="newUserName"/>
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">E-Mail</label><br>
            <input id="email" class="form-control" v-model="newUserEmail"/>
          </div>

          <button class="btn btn-primary" @click.prevent="postUser">Save user</button>
          <p v-if="usersApiError">Error: {{ usersApiError }}</p>
        </form>

        <div class="row" v-if="users">
          <div class="col">
            <h1>Existing users</h1>
          </div>
        </div>
        <div class="row" v-if="users">
          <div class="col">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">name</th>
                  <th scope="col">e-mail</th>
                  <th scope="col">actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.name">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td v-if="user.name == null || user.name !== mailSentToUser"><button class="btn btn-primary" @click.prevent="postSendmail(user.name)">Send (re)set-password e-mail</button></td>
                  <td v-if="user.name === mailSentToUser">E-mail sent to user {{ mailSentToUser }}</td>
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
    loggedInUser: Object
  },
  components: {
    Datepicker
  },
  data() {
    return {
      events: null,
      eventsApiError: null,
      newEventName: "",
      newEventDate: ref(new Date()),
      users: null,
      usersApiError: null,
      newUserName: "",
      newUserEmail: "",
      sendmailApiError: null,
      mailSentToUser: null
    }
  },
  created: function () {
    this.getAllEvents();
    this.getAllUsers();
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
    async getAllEvents() {
      var result = await getFromApi(this.$eventsApiUrl);
      if (result.error != null) {
        this.eventsApiError = result.error;
      } else {
        this.events = this.getSortedEventItemsFromResult(result);
      }
    },
    async postEvent(eventName, eventDate, eventUsers) {
      const event = {
        username: this.loggedInUser.username,
        name: eventName,
        date: new Date(eventDate),
        users: JSON.stringify(eventUsers)
      };
      var result = await postToApi(this.$eventsApiUrl, event);
      if (result.error != null) {
        this.eventsApiError = result.error;
      } else {
        await this.getAllEvents();
      }
    },
    userEventAssignmentChanged(checkboxChangedEvent, user, event) {
      if (checkboxChangedEvent.target.checked) {
        this.postEvent(event.name, event.date, [...event.users, {name: user.name}]);
      } else {
        var reducedUsers = [];
        for (let i = 0; i < event.users.length; i++) {
          if (event.users[i].name !== user.name) {
            reducedUsers.push({name: event.users[i].name});
          }
        }
        this.postEvent(event.name, event.date, reducedUsers);
      }
    },
    isUserAssignedToEvent(user, event) {
      for (let i = 0; i < event.users.length; i++) {
        if (event.users[i].name === user.name) {
          return true;
        }
      }
      return false;
    },
    getSortedUserItemsFromResult(result) {
      return result.data.Users.sort((a, b) => a.name > b.name && 1 || -1);
    },
    async getAllUsers() {
      var result = await getFromApi(this.$usersApiUrl);
      if (result.error != null) {
        this.usersApiError = result.error;
      } else {
        this.users = this.getSortedUserItemsFromResult(result);
      }
    },
    async postUser() {
      const user = {
        username: this.loggedInUser.username,
        name: this.newUserName,
        email: this.newUserEmail
      };
      var result = await postToApi(this.$usersApiUrl, user);
      if (result.error != null) {
        this.usersApiError = result.error;
      } else {
        await this.getAllUsers();
      }
    },
    async postSendmail(mailtargetUsername) {
      const data = {
        username: mailtargetUsername
      };
      var result = await postToApi(this.$sendmailApiUrl, data);
      if (result.error != null) {
        this.sendmailApiError = result.error;
      } else {
        this.mailSentToUser = mailtargetUsername;
      }
    }
  }
}
</script>

<style>
</style>
