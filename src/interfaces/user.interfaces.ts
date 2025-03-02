export interface UserPublic {
    id: number,
    name: string,
    lastName: string,
    email: string,
    profile: string
}

export interface UserCreation {
    id: number,
    name: string,
    lastName: string,
    email: string,
    profile: string,
    validationToken: string | boolean
}

export interface AuthPayload {
    email: string,
    profile: string
}
