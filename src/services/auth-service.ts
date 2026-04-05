/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { AxiosResponse } from 'axios'

export const authService = {
  signup: (userData: Record<string, unknown>): Promise<AxiosResponse> => {
    return axios.post('http://localhost:8080/auth/signup', userData, {
      withCredentials: true
    })
  },

  login: (loginData: Record<string, unknown>): Promise<AxiosResponse> => {
    return axios.post('http://localhost:8080/auth/login', loginData, {
      withCredentials: true
    })
  },

  googleAuth: (token: string, role: string): Promise<AxiosResponse> => {
    return axios.post(
      'http://localhost:8080/auth/google-login',
      { token, role },
      {
        withCredentials: true
      }
    )
  }
}

export const AuthService = authService

export const useGoogleAuthMutation = () => {
  const mutation = async (args: { token: string; role: string }) => {
    const response: AxiosResponse<{ data: unknown }> =
      await authService.googleAuth(args.token, args.role)
    return { data: response.data }
  }
  return [mutation, { isLoading: false }] as const
}

export const useLoginMutation = () => {
  const mutation = async (data: Record<string, unknown>) => {
    const response: AxiosResponse<{ data: unknown }> =
      await authService.login(data)
    return { data: response.data }
  }
  return [mutation, { isLoading: false }] as const
}

export const useLogoutMutation = () => {
  const mutation = async () => {
    return axios.post(
      'http://localhost:8080/auth/logout',
      {},
      { withCredentials: true }
    )
  }
  return [mutation, { isLoading: false }] as const
}
