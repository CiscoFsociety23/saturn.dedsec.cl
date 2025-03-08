export interface UserPublic {
    id: number,
    name: string,
    lastName: string,
    email: string,
    profile: string
    status: string
}

export interface AuthPayload {
    email: string,
    profile: string
}

export interface LogIn {
    email: string,
    passwd: string
}
