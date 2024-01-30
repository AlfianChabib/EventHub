import axios from 'axios';

axios.defaults.withCredentials = true;

export const getAnalyticsEventYear = async () => {
  try {
    const response = await axios
      .get(`http://localhost:8000/api/analytics/analytics-order-year`, {
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
