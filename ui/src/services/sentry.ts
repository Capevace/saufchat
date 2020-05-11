import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

Sentry.init({
	dsn:
		'https://ac7a4d27407343778fa2dae365e9929e@o389669.ingest.sentry.io/5228135',
	integrations: [
		new VueIntegration({ Vue, attachProps: true, logErrors: true })
	]
});
