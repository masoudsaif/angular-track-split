export default interface ITransaction {
  title: string;
  description: string;
  paid_by: PaidBy;
  category: string;
  amount: number;
  date: number;
  receipt: Receipt;
}

export interface PaidBy {
  user_id: string;
  fullname: string;
}

export interface Receipt {
  filename: string;
  originalname: string;
}
