import { Contract } from "fabric-network";

declare global {
  namespace Express {
    interface Request {
      contract: Contract
    }
  }
}