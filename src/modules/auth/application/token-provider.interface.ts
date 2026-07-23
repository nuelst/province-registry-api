export interface TokenPayload {
  sub: string; // user id
  email: string;
}

export interface TokenProvider {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
