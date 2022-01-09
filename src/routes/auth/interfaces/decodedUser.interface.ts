export interface DecodedUser {
  readonly userId: string;

  readonly email: string;

  readonly password: string;

  readonly role: string;

  readonly iat?: number;

  readonly exp?: number;
}
