import axios from 'axios';
import { getProfilePath } from '../backend';
import { UserProfile } from '../types/index';

export const indexProfile = async (): Promise<UserProfile | null> => {
  const path = getProfilePath();
  try {
    const response = await axios.get(path);
    const data: UserProfile = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
