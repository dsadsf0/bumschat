const ValidationService = {
	validateUsername: (username: string): boolean => {
		return username.length <= 60 && username.length >= 2 && username.search(/^[\p{L}A-Za-z \d_-]+$/g) !== -1 && username.trim().length === username.length;
	},

	validate2FA: (code: string): boolean => {
		return code.length === 6 && !isNaN(Number(code));
	},
};

export default ValidationService;
