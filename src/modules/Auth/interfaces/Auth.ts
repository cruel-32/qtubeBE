export interface GoogleLoginRequest {
  idToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    nickName: string;
    picture?: string;
    platform: string;
  };
}

import { z } from 'zod'

export const TestLoginSchema = z.object({
  userId: z.string().min(1, 'userId는 필수입니다'),
})

export type TestLoginRequest = z.infer<typeof TestLoginSchema>