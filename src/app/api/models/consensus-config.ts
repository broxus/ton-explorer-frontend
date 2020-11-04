/* tslint:disable */
export interface ConsensusConfig {
  attemptDuration: number;
  catchainMaxDeps: number;
  consensusTimeoutMs: number;
  fastAttempts: number;
  flags?: number;
  maxBlockBytes: number;
  maxCollatedBytes: number;
  newCatchainIds?: boolean;
  nextCandidateDelayMs: number;
  roundCandidates: number;
}
