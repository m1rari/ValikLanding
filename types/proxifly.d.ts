declare module "proxifly" {
  export class Proxifly {
    constructor(options?: { apiKey?: string; url?: string; debug?: boolean });
    getProxy(options?: {
      protocol?: string;
      anonymity?: string;
      country?: string;
      https?: boolean;
      quantity?: number;
      format?: string;
      timeout?: number;
    }): Promise<unknown>;
  }
  export default Proxifly;
}
