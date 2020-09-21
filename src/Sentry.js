// Copyright (C) 2019, Zpalmtree
// Copyright (C) 2020, 2ACoin Devs
//
// Please see the included LICENSE file for more information.

import * as Sentry from '@sentry/react-native';

import * as _ from 'lodash';

import Config from './Config';

/* Manually comparing to 2ACoin to try and prevent getting errors reported
   for forks... */
/* DO NOT CHANGE THIS LINE WITHOUT ALSO ALTERING THE Sentry.config() LINE - See readme and sentry docs. */
const sentryIsEnabled = !__DEV__ && Config.coinName === '2ACoin';

export function reportCaughtException(err) {
    /* Sentry doesn't properly report arbitary objects. Convert to string if
       it ain't a string or an error. */
    if (!_.isString(err) && !(err instanceof Error)) {
        err = JSON.stringify(err, null, 4);
    }

    if (sentryIsEnabled) {
        try {
            Sentry.captureException(err);
        } catch (e) {
        }
    }
}

export function initSentry() {
    if (sentryIsEnabled) {
        /* CHANGE THIS IF YOU ARE FORKING! */
        Sentry.init({ 
		  /* Eco Dev System Sentry */
          //dsn: 'https://68c0325b83bc4e75bd49d77aaead413a@o450284.ingest.sentry.io/5434906', 
		  /* 2ACoin Sentry */
          dsn: 'https://14dd359d38314269b1be5b2c164a478e@sentry.io/1482559', 
        });

        Sentry.setRelease('com.armsvault-' + Config.appVersion);
    }
}
