import axios from 'axios';

axios.defaults.withCredentials = true;

export const getSessionClient = async (
  userToken: string | undefined,
): Promise<object | undefined> => {
  try {
    if (!userToken) {
      return undefined;
    } else {
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
    }
  } catch (error) {
    console.log(error);
  }
};

interface EventData {
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  seats: number;
  startDate: Date;
  endDate: Date;
  duration: string;
}

export type EventDataResponse = {
  data: EventData;
};

export const getEventByUserSession = async (
  userToken: string | undefined,
): Promise<EventDataResponse[] | undefined> => {
  try {
    if (!userToken) {
      return undefined;
    } else {
      const response = await axios
        .get('http://localhost:8000/api/event/management', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));

      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};
