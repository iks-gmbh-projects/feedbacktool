<template>
  <div class="container" id="comments">
    <div v-if="loggedIn && currentEventName != null && isEventExistingAndLoggedInUserAssigned()">
      <div class="row">
        <div class="col">
          <h1>{{ currentEventName }} - New comment</h1>
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

        <button class="btn btn-primary" @click.prevent="postComment">Submit comment</button>
        <p v-if="commentsApiError">Error: {{ commentsApiError }}</p>
      </form>

      <div class="row" v-if="comments">
        <div class="col">
          <h1>{{ currentEventName }} - Last submitted comments</h1>
        </div>
      </div>
      <div class="row" v-if="comments">
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
            <tr v-for="comment in comments" :key="comment.date">
              <td>{{ formatDate(comment.date) }}</td>
              <td>{{ comment.name }}</td>
              <td>{{ comment.message }}</td>
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
      queryParameters: this.$route.query,
      comments: null,
      commentsApiError: null,
      name: "",
      newMessage: "",
      events: null,
      eventsApiError: null
    }
  },
  created: function () {
    this.getAllEvents();
    this.getAllComments();
  },
  computed: {
    loggedIn() {
      return this.loggedInUser && this.loggedInUser.username;
    },
    currentEventName() {
      return this.queryParameters.event;
    }
  },
  methods: {
    async getAllEvents() {
      var result = await getFromApi(this.$eventsApiUrl);
      if (result.error != null) {
        this.eventsApiError = result.error;
      } else {
        this.events = result.data.Items;
      }
    },
    isEventExistingAndLoggedInUserAssigned() {
      var event = null;
      for (let i = 0; i < this.events.length; i++) {
        if (this.events[i].name === this.currentEventName) {
          event = this.events[i];
        }
      }
      if (event == null) {
        return false;
      }
      for (let i = 0; i < event.users.length; i++) {
        if (event.users[i].name === this.loggedInUser.username) {
          return true;
        }
      }
      return false;
    },
    formatDate(dateNumeric) {
      return format(new Date(dateNumeric), 'dd.MM.yyyy HH:mm:ss.SSS');
    },
    getResultItemsFilteredByEvent(resultItems) {
      var filteredResultItems = [];
      for (let i = 0; i < resultItems.length; i++) {
        if (resultItems[i].event === this.currentEventName) {
            filteredResultItems.push(resultItems[i]);
        }
      }
      return filteredResultItems;
    },
    getSortedResultItems(resultItems) {
      return resultItems.sort((a, b) => a.date < b.date && 1 || -1);
    },
    async getAllComments() {
      var result = await getFromApi(this.$commentsApiUrl);
      if (result.error != null) {
        this.commentsApiError = result.error;
      } else {
        var filteredResultItems = this.getResultItemsFilteredByEvent(result.data.Items);
        this.comments = this.getSortedResultItems(filteredResultItems);
      }
    },
    async postComment() {
      const data = {
        username: this.loggedInUser.username,
        name: this.name,
        message: this.newMessage,
        event: this.currentEventName
      };
      var result = await postToApi(this.$commentsApiUrl, data);
      if (result.error != null) {
        this.commentsApiError = result.error;
      } else {
        await this.getAllComments();
      }
    }
  }
}
</script>

<style>
</style>
