const validateUsername = (username: string): boolean => {
    return username.length <= 60 
        && username.length >= 2
        && username.replace(/^[a-zA-Z0-9-_ ]*$/g, '') === ''
        && username.trim().length === username.length;
}

export default validateUsername