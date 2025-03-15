import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import type { Command } from 'pastel'
import Call from './call.js'
import Create from './create.js'
import SetAccount from './setAccount.js'

export const options = zod.object({
	name: zod.string().default('Stranger').describe('Name'),
});

type Props = {
	options: zod.infer<typeof options>;
};

const cli = {
	name: 'tevm',
	version: '0.1.0',
	description: 'tevm cli',
	commands: {
		call: Call,
		create: Create,
		setAccount: SetAccount,
	},
} satisfies Command

export default cli
