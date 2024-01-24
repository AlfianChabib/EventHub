import { apiSlice } from '../api/apiSlice';
import { userLoggedIn, userLoggedOut, userRegistration } from './authSlice';

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //registration
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        // endpoint/registration
        url: 'registration',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
      // it will return data
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // it will return data
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              // setting userRegistration token in redux store
              token: result.data.activationToken,
            }),
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    // activation take input
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: 'activate-user',
        method: 'POST',
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),

    // login call
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: 'login',
        method: 'POST',
        body: {
          email,
          password,
        },
        credentials: 'include' as const,
      }),
      // it will return data
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            }),
          );
        } catch (error: any) {
          // console.log(error);
        }
      },
    }),
    // login call
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: 'social-auth',
        method: 'POST',
        body: {
          email,
          name,
          avatar,
        },
        credentials: 'include' as const,
      }),
      // it will return data
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            }),
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    // logout
    logout: builder.query({
      query: () => ({
        url: 'logout',
        method: 'GET',
        credentials: 'include' as const,
      }),
      // it will return data
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogoutQuery,
} = authApi;
