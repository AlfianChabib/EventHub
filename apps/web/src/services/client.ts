import axios from 'axios';

axios.defaults.withCredentials = true;

export interface SessionData {
  id: number;
  name: string;
  username: string;
  email: string;
  image?: string;
  referral: string;
  role: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

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

export interface ProfileUser {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  referral: string;
  phone: string;
  image: string;
  role: string;
  created_at: string;
  updated_at: string;
  point: Point[];
  tickets: any[];
  voucher: Voucher[];
  eventPromotion: any[];
}

interface Point {
  id: number;
  userId: number;
  expireDate: Date;
}

interface Voucher {
  id: number;
  userId: number;
  expireDate: Date;
}

// : Promise<object | undefined>
export const getSessionClient = async (
  userToken: string | undefined,
): Promise<ProfileUser | undefined> => {
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

export const getProfileUser = async (
  userToken: string | undefined,
): Promise<ProfileUser | undefined> => {
  try {
    if (!userToken) {
      return undefined;
    } else {
      const response = await axios
        .get('http://localhost:8000/api/user/data', {
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

// : Promise<EventDataResponse[] | undefined>
