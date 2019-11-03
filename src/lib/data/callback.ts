import axios, { AxiosResponse, AxiosError } from 'axios';

import { Order, Callback, CallbackError, Hero } from '../interfaces';
import { apiUrl } from './config';

const getHeroesCallback = function(
  email: string,
  callback: Callback<Hero>,
  callbackError?: CallbackError
) {
  axios
    .get<Hero[]>(`${apiUrl}/heroes?email=${email}`)
    .then((response: AxiosResponse<any>) => {
      const data = parseList<Hero>(response);
      const hero = data[0];
      callback(hero);
    })
    .catch((error: AxiosError) => {
      console.error(`Developer Error: Async Data Error: ${error.message}`);
      callbackError('User Facing Error: Something bad happened');
    });
};

const getOrdersCallback = function(
  heroId: number,
  callback: Callback<Order[]>,
  callbackError?: CallbackError
) {
  const url = heroId ? `${apiUrl}/orders/${heroId}` : `${apiUrl}/orders`;
  axios
    .get(url)
    .then((response: AxiosResponse<any>) => {
      const orders = parseList<Order>(response);
      callback(orders);
    })
    .catch((error: AxiosError) => {
      console.error(`Developer Error: Async Data Error: ${error.message}`);
      callbackError('User Facing Error: Something bad happened');
    });
};

const parseList = <T>(response: any) => {
  if (response.status !== 200) throw Error(response.message);
  if (!response.data) return [];
  let list: T[] = response.data;
  if (typeof list !== 'object') {
    list = [];
  }
  return list;
};

export { getHeroesCallback, getOrdersCallback };
