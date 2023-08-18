export type PaymentMethod = {
    id?: number;
    code: string;
    name: string;
};

export type PaymentMethodProps = {
  id?: number;
  paymentMethod?: PaymentMethod;
  isFromDetails?: boolean;
};

export type PaymentMethodListProps = {
  paymentMethodList: PaymentMethod[];
};