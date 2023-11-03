const Endpoints = {
	Global: 'api/v1',
	Ping: 'ping',
	User: {
		Root: 'users',
		Login: 'login',
		UsernameCheck: 'username-check',
		Logout: 'logout',
		Delete: 'completely-delete',
		Recovery: 'recovery',
		Qr: 'qr',
		GlobalKey: 'global-key',
		PublicKey: 'public-key',
		RequestToken: 'request-token',
	},
} as const;

export default Endpoints;
