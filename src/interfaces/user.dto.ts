import { IsEmail, IsNumber, IsString, MinLength } from "class-validator"

export class UserDto {
    
    @IsString()
    @MinLength(1)
    name: string

    @IsString()
    @MinLength(1)
    lastName: string

    @IsEmail()
    email: string
    
    @IsString()
    passwd: string

    @IsNumber()
    profile: number

}

export class UserTokenDto {
    @IsEmail()
    email: string;

    @IsString()
    profile: string;

    @IsNumber()
    iat: number;

    @IsNumber()
    exp: number;
}

export class UserUpdateDto {
    name?: string;
    lastName?: string;
    @IsString()
    email: string;
    passwd?: string;
    id_profile?: number;
}
