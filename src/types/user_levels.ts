import { Service } from './service';

export type UserLevel = {
    id?: number;
    name: string;
    service_id: number | null;
    observations: string;
};

export type UserLevelProps = {
  id?: number;
  userLevel?: UserLevel;
  isFromDetails?: boolean;
  services: Service[];
};

export type UserLevelListProps = {
  userLevelList: UserLevel[];
  servicesList: Service[];
};