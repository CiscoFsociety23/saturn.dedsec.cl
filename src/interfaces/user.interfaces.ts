export interface UserPublic {
    id: number,
    name: string,
    lastName: string,
    email: string,
    profile: string
}

export interface AuthPayload {
    email: string,
    profile: string
}
