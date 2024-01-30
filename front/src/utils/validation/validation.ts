const UsernameRestrictions = {
    UsernameRegex: /^[\p{N}\p{S}\p{L}a-zа-яё ?!#+=$%^&*()\\<>\/\d_-]+$/giu,
    MinLength: 3,
    MaxLength: 30,
} as const;

const ValidationService = {
    validateUsername: (username: string): boolean => {
        return (
            username.length <= UsernameRestrictions.MaxLength &&
            username.length >= UsernameRestrictions.MinLength &&
            UsernameRestrictions.UsernameRegex.test(username) &&
            username.trim().length === username.length
        );
    },

    validate2FA: (code: string): boolean => {
        return code.length === 6 && !isNaN(Number(code));
    },
};

export default ValidationService;
