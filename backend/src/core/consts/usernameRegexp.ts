const UsernameRestrictions = {
	UsernameRegex: /^[\p{N}\p{S}\p{L}a-zа-яё ?!#+=$%^&*()\\<>\/\d_-]+$/giu,
	MinLength: 3,
	MaxLength: 30,
} as const;

export default UsernameRestrictions;
