export interface TokenPayload {
    id: string;
    email: string;
}

export interface RefreshTokenData {
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}
