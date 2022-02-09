import Vue from 'vue'
import App from './App.vue'
import Amplify from 'aws-amplify';
import {
  applyPolyfills,
  defineCustomElements,
} from '@aws-amplify/ui-components/loader';
import 'bootstrap';
import '@/assets/scss/custom.scss';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_gi9SMtHk1',
    userPoolWebClientId: '6717f37h9q7klrqrnl5v90l92',
    oauth: {
      domain: 'comments-login.auth.eu-central-1.amazoncognito.com',
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'https://d2kjzokq5ljamp.cloudfront.net/index.html',
      redirectSignOut: 'https://d2kjzokq5ljamp.cloudfront.net/signout',
      responseType: 'code'
    },
    cookieStorage: {
      domain: '.comments-login.auth.eu-central-1.amazoncognito.com',
      secure: false,
      path: '/',
      expires: 365
    },
  }
});
applyPolyfills().then(() => {
  defineCustomElements(window);
});

Vue.prototype.$apiUrl = "https://6qt340l8p3.execute-api.eu-central-1.amazonaws.com";

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
