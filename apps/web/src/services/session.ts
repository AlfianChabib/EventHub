import { cookies } from 'next/headers';
import axios from 'axios';

export const getSession = async () => {
  try {
    const cookieStore = cookies();
    const userToken = cookieStore.get('user-token');
    if (!userToken) return {};
    const response = await axios
      .get('http://localhost:8000/api/auth/session', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken?.value}`,
        },
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
