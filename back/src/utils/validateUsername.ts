const validateUsername = (username: string): boolean => {
    return username.length <= 60 
        && username.length >= 2
        && username.replace(/^[a-zа-яё0-9-_ ]*$/gui, '') === ''
        && username.trim().length === username.length;
}
export default validateUsername;