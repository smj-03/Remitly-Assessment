export interface IBaseSwiftCode {
  address: string;
  bankName: string;
  countryISO2: string;
  isHeadquarter: boolean;
  swiftCode: string;
}

export interface IBranchSwiftCode extends IBaseSwiftCode {
  countryName: string;
}

export interface IHeadquarterSwiftCode extends IBranchSwiftCode {
  branches: IBaseSwiftCode[];
}

export interface ICountrySwiftCodes {
  countryISO2: string;
  countryName: string;
  swiftCodes: IBaseSwiftCode[];
}
