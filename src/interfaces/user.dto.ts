import { IsEmail, IsString, MinLength } from "class-validator"

export class User {
    
    @IsString()
    @MinLength(1)
    name: string

    @IsString()
    @MinLength(1)
    lastName: string

    @IsEmail()
    email: string
}
