import axios from 'axios';

axios.defaults.withCredentials = true;

export const getEventById = async (id: string) => {
  try {
    const response = await axios
      .get(`http://localhost:8000/api/event/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
