import { cookies } from 'next/headers';
import axios from 'axios';
import { SessionData } from './client';

axios.defaults.withCredentials = true;

export const getSession = async (): Promise<SessionData | undefined> => {
  try {
    const cookieStore = cookies();
    const userToken = cookieStore.get('user-token');
    if (!userToken) return undefined;
    const response = await axios
      .get('http://localhost:8000/api/auth/session', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
