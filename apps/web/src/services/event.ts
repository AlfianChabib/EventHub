import { PaginationDataResult } from '@/@types/event';
import axios, { AxiosError } from 'axios';

axios.defaults.withCredentials = true;

export const getEventById = async (id: string) => {
  try {
    const response = await axios
      .get(`http://localhost:8000/api/event/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllEvents = async (
  page: number,
  limit: number,
  search: string,
  category: string,
): Promise<PaginationDataResult | undefined> => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/event/all-event?page=${page}&limit=${limit}&search=${search}&category=${category}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.data;
  } catch (error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      console.log(error.status);
      console.error(error.response);
      return error.response?.data;
    } else {
      console.error(error);
    }
  }
};
