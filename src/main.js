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
      scope: ['phone', 'email', 'openid'],
      redirectSignIn: 'https://comments-bucket-20220201.s3.eu-central-1.amazonaws.com/index.html',
      redirectSignOut: 'https://comments-bucket-20220201.s3.eu-central-1.amazonaws.com/logout.html',
      responseType: 'code'
    }
  }
});
applyPolyfills().then(() => {
  defineCustomElements(window);
});


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
