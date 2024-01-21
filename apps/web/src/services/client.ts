import axios from 'axios';

axios.defaults.withCredentials = true;

export const getSessionClient = async (
  userToken: string | undefined,
): Promise<object | undefined> => {
  try {
    if (!userToken) return {};

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
