import { OrderData } from '@/components/event/TicketOrder';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const orderTransaction = async (
  orderData: OrderData,
  userToken: string | undefined,
) => {
  try {
    if (!userToken) return 'Unauthorized';
    const response = await axios
      .post(
        `http://localhost:8000/api/transaction/order`,
        JSON.stringify(orderData),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        },
      )
      .then((res) => res.data)
      .catch((err) => console.log(err));

    return response;
  } catch (error) {
    console.log(error);
  }
};
