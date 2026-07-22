export interface Province {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateProvinceProps = Pick<Province, 'name'>;
export type UpdateProvinceProps = Partial<Pick<Province, 'name'>>;
