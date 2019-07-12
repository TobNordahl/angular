export class PensionInformation{
  id: number;
  age: number;
  salary: number;
  deposit: number;
  pensionAge: number;
  duration: number;
  kapital: number;
  trad: number;
  risk: number;
  expReturn: number;
}

export class Pensions{
  pensionType: string;
  information: PensionInformation[];
}

export class PlotData{
 M: any[];
 V: any[];
 hogtUtfall: any[];
 lagtUtfall: any[];
 time: any[]
}