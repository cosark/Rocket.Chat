import { ServiceConfiguration } from 'meteor/service-configuration';

export async function removeOAuthService(mainSettingId: string): Promise<void> {
	const serviceName = mainSettingId.replace('Accounts_OAuth_Custom-', '');
	console.log('DEBUGOAUTH', 'removeOAuthService', serviceName);

	await ServiceConfiguration.configurations.removeAsync({
		service: serviceName.toLowerCase(),
	});
}
