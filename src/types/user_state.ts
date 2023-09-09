export type UserState = {
    id: number;
    name: string;
    es_name: string,
    zh_name: string,
    value: string,
    position: number,
}

export type UserStateDefault = {
  normal: UserState,
  frezze: UserState,
  pending_payment: UserState,
};