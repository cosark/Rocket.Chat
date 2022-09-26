import type { IUser } from '@rocket.chat/core-typings';
import type { Filter, FindCursor, FindOptions } from 'mongodb';
import type { FindPaginated } from '@rocket.chat/model-typings';
import { Users } from '@rocket.chat/models';

import { settings } from '../../app/settings/server';

type FindUsersParam = {
	rid: string;
	status?: string;
	skip?: number;
	limit?: number;
	filter?: string;
	sort?: Record<string, any>;
};

export function findUsersOfRoom({
	rid,
	status,
	skip = 0,
	limit = 0,
	filter = '',
	sort = {},
}: FindUsersParam): FindPaginated<FindCursor<IUser>> {
	const options: FindOptions<IUser> = {
		projection: {
			name: 1,
			username: 1,
			nickname: 1,
			status: 1,
			avatarETag: 1,
			_updatedAt: 1,
			federated: 1,
		},
		sort: {
			statusConnection: -1,
			...(sort || { [settings.get('UI_Use_Real_Name') ? 'name' : 'username']: 1 }),
		},
		...(skip > 0 && { skip }),
		...(limit > 0 && { limit }),
	};

	const searchFields = settings.get<string>('Accounts_SearchFields').trim().split(',') as Array<keyof IUser>;

	return Users.findPaginatedByActiveUsersExcept(filter, [], options, searchFields, [
		{
			__rooms: rid,
			...(status && { status }),
		} as Filter<IUser>,
	]);
}
