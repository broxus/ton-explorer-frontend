/* tslint:disable */
import { CatchainConfig } from './catchain-config';
import { ConfigBlockCreateFees } from './config-block-create-fees';
import { ConfigBlockLimits } from './config-block-limits';
import { ConfigComplaintPricing } from './config-complaint-pricing';
import { ConfigGasLimitsPrices } from './config-gas-limits-prices';
import { ConfigMintPrice } from './config-mint-price';
import { ConfigMsgForwardPrices } from './config-msg-forward-prices';
import { ConfigStoragePrice } from './config-storage-price';
import { ConfigValidatorsQuantityLimits } from './config-validators-quantity-limits';
import { ConfigValidatorsStakeLimits } from './config-validators-stake-limits';
import { ConfigValidatorsTimings } from './config-validators-timings';
import { ConfigVotingSetup } from './config-voting-setup';
import { ConfigWorkchainInfo } from './config-workchain-info';
import { ConsensusConfig } from './consensus-config';
import { GlobalVersion } from './global-version';
import { ValidatorSet } from './validator-set';
export interface BlockchainConfig {
  basechainBlockLimits?: ConfigBlockLimits;
  basechainGasPrices?: ConfigGasLimitsPrices;
  basechainMsgForwardPrices?: ConfigMsgForwardPrices;
  blockCreateFees?: ConfigBlockCreateFees;
  catchainConfig?: CatchainConfig;
  complaintPricing?: ConfigComplaintPricing;
  configAddr?: string;
  configVotingSetup?: ConfigVotingSetup;
  consensusConfig?: ConsensusConfig;
  criticalParams?: Array<number>;
  currTempVset?: ValidatorSet;
  currVset?: ValidatorSet;
  dnsRootAddr?: string;
  electorAddr?: string;
  feeCollectorAddr?: string;
  fundamentalSmcAddresses?: Array<string>;
  globalVersion?: GlobalVersion;
  mandatoryParams?: Array<number>;
  masterchainBlockLimits?: ConfigBlockLimits;
  masterchainGasPrices?: ConfigGasLimitsPrices;
  masterchainMsgForwardPrices?: ConfigMsgForwardPrices;
  mintPrice?: ConfigMintPrice;
  minterAddr?: string;
  nextTempVset?: ValidatorSet;
  nextVset?: ValidatorSet;
  prevTempVset?: ValidatorSet;
  prevVset?: ValidatorSet;
  storagePrices?: Array<ConfigStoragePrice>;
  toMint?: Array<string>;
  validatorsQuantityLimits?: ConfigValidatorsQuantityLimits;
  validatorsStakeLimits?: ConfigValidatorsStakeLimits;
  validatorsTimings?: ConfigValidatorsTimings;
  workchains?: Array<ConfigWorkchainInfo>;
}
