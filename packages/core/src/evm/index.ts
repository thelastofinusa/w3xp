export {
  fetchEVMContract,
  fetchEVMContractByChainId,
  fetchEVMContractViaWhatsABI,
} from "./lib/fetchContract"
export { POPULAR_EVM_NETWORKS, type NetworkOption } from "./lib/chains"
export { normaliseRawAbi } from "./lib/normaliseRawAbi"
export { createContractFromAbi } from "./lib/createContract"
