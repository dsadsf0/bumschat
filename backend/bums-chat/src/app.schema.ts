export type AppConfigSchema = {
    PORT: number;
    MONGO_CONNECT: string;
    MONGO_NAME: string;
	CLIENT_URL: string;
	PASS_SALT_ROUNDS: number;
	AUTH_TOKEN_SALT_ROUNDS: number,
	UUID_NAMESPACE: string;
};
