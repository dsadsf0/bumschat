const Endpoints = {
	Global: 'api/v1',
	Ping: 'ping',
	User: {
		Root: 'users',
		Login: {
			Root: 'login',
			UsernameCheck: 'username-check',
		},
		Logout: 'logout',
		Delete: 'completely-delete',
		Recovery: 'recovery',
		Qr: 'qr',
		GlobalKey: 'global-key',
	},
} as const;

export default Endpoints;
