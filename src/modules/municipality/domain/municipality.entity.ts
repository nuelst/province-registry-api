export interface Municipality {
  id: string;
  name: string;
  province: string; // id da província
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMunicipalityProps {
  name: string;
  province: string;
}

export type UpdateMunicipalityProps = Partial<CreateMunicipalityProps>;
