export interface BasicSwiftCode {
  address: string;
  bankName: string;
  countryISO2: string;
  isHeadquarter?: boolean;
  swiftCode: string;
}

export interface BranchSwiftCode extends BasicSwiftCode {
  countryName: string;
}

export interface HeadquarterSwiftCode extends BranchSwiftCode {
  branches: BasicSwiftCode[];
}

export interface CountrySwiftCodesResponse {
  countryISO2: string;
  countryName: string;
  swiftCodes: BasicSwiftCode[];
}
