import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

let env = globalProperties.getCurrentEnv();

Sentry.init({
    environment: env,
    dsn: 'http://b07532c69d01467c823ee5bd092cc262@47.99.66.191:9000/7',
    integrations: [
        new Integrations.Vue({
            Vue,
            attachProps: true,
        }),
    ],
});

Vue.config.errorHandler = (err, vm, info) => {
    if (process.env.NODE_ENV !== 'production') {
        Vue.util.warn(`Error in ${info}: "${err.toString()}"`, vm);
    }
    console.error(err);
};