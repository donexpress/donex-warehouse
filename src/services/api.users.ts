import axios from 'axios';
import { getProfilePath } from '../backend';
import { UserProfile } from '../types/index';

export const indexProfile = async (): Promise<UserProfile | null> => {
  const path = getProfilePath();
  try {
    //const response = await axios.get(path);
    const data: UserProfile = {
      id: 1,
      username: 'connor92', 
      fullname: 'Connor Street Eugene',
      profile_image: 'https://img.freepik.com/foto-gratis/joven-confiado_1098-20868.jpg?t=st=1681790781~exp=1681791381~hmac=e7a9f1fd2c2ff3892d470cd5a02a18d08db3ef4524596f1dbaa5cde540254dda',
      phone_number: '1234***5678',
      email: 'test***135@gmail.com'
    };
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
