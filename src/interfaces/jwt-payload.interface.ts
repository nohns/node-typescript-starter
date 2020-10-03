export interface JwtPayload {
    // user id, username and role
    sub: string;
    username: string;
    role: string;
}