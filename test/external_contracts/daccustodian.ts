// =====================================================
// WARNING: GENERATED FILE
//
// Any changes you make will be overwritten by Lamington
// =====================================================

import { Account, Contract, GetTableRowsOptions, TableRowsResult } from 'lamington';

// Table row types
export interface DaccustodianCandidates {
	candidate_name: string|number;
	requestedpay: string;
	locked_tokens: string;
	total_votes: number;
	is_active: number;
	custodian_end_time_stamp: string;
}

export interface DaccustodianCandperms {
	cand: string|number;
	permission: string|number;
}

export interface DaccustodianConfig2 {
	lockupasset: string;
	maxvotes: number;
	numelected: number;
	periodlength: number;
	should_pay_via_service_provider: boolean;
	initial_vote_quorum_percent: number;
	vote_quorum_percent: number;
	auth_threshold_high: number;
	auth_threshold_mid: number;
	auth_threshold_low: number;
	lockup_release_time_delay: number;
	requested_pay_max: string;
}

export interface DaccustodianCustodians {
	cust_name: string|number;
	requestedpay: string;
	total_votes: number;
}

export interface DaccustodianPendingpay {
	key: number;
	receiver: string|number;
	quantity: string;
	memo: string;
}

export interface DaccustodianPendingpay2 {
	key: number;
	receiver: string|number;
	quantity: string;
	due_date: string;
}

export interface DaccustodianPendingstake {
	sender: string|number;
	quantity: string;
	memo: string;
}

export interface DaccustodianState {
	lastperiodtime: string;
	total_weight_of_votes: number;
	total_votes_on_candidates: number;
	number_active_candidates: number;
	met_initial_votes_threshold: boolean;
}

export interface DaccustodianVotes {
	voter: string|number;
	proxy: string|number;
	candidates: Array<string|number>;
}

export interface Daccustodian extends Contract {
	// Actions
	balanceobsv(account_balance_deltas: Array<string>, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	capturestake(from: string|number, quantity: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	claimpay(payid: number, options?: { from?: Account }): Promise<any>;
	claimpaye(payid: number, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	clearold(batch_size: number, options?: { from?: Account }): Promise<any>;
	clearstake(cand: string|number, new_value: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	firecand(cand: string|number, lockupStake: boolean, options?: { from?: Account }): Promise<any>;
	firecande(cand: string|number, lockupStake: boolean, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	firecust(cust: string|number, options?: { from?: Account }): Promise<any>;
	firecuste(cust: string|number, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	migrate(batch_size: number, options?: { from?: Account }): Promise<any>;
	newperiod(message: string, options?: { from?: Account }): Promise<any>;
	newperiode(message: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	nominatecand(cand: string|number, requestedpay: string, options?: { from?: Account }): Promise<any>;
	nominatecane(cand: string|number, requestedpay: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	rejectcuspay(payid: number, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	removecuspay(payid: number, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	resigncust(cust: string|number, options?: { from?: Account }): Promise<any>;
	resigncuste(cust: string|number, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	runnewperiod(message: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	setperm(cand: string|number, permission: string|number, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	stakeobsv(account_stake_deltas: Array<string>, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	stprofile(cand: string|number, profile: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	stprofileuns(cand: string|number, profile: string, options?: { from?: Account }): Promise<any>;
	transferobsv(from: string|number, to: string|number, quantity: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	unstake(cand: string|number, options?: { from?: Account }): Promise<any>;
	unstakee(cand: string|number, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	updatebio(cand: string|number, bio: string, options?: { from?: Account }): Promise<any>;
	updatebioe(cand: string|number, bio: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	updateconfig(newconfig: string, options?: { from?: Account }): Promise<any>;
	updateconfige(newconfig: any, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	updatereqpae(cand: string|number, requestedpay: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	updatereqpay(cand: string|number, requestedpay: string, options?: { from?: Account }): Promise<any>;
	votecust(voter: string|number, newvotes: Array<string|number>, options?: { from?: Account }): Promise<any>;
	votecuste(voter: string|number, newvotes: Array<string|number>, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	weightobsv(account_weight_deltas: Array<string>, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	withdrawcand(cand: string|number, options?: { from?: Account }): Promise<any>;
	withdrawcane(cand: string|number, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	
	// Tables
	candidates(options?: GetTableRowsOptions): Promise<TableRowsResult<DaccustodianCandidates>>;
	candperms(options?: GetTableRowsOptions): Promise<TableRowsResult<DaccustodianCandperms>>;
	config2(options?: GetTableRowsOptions): Promise<TableRowsResult<DaccustodianConfig2>>;
	custodians(options?: GetTableRowsOptions): Promise<TableRowsResult<DaccustodianCustodians>>;
	pendingpay(options?: GetTableRowsOptions): Promise<TableRowsResult<DaccustodianPendingpay>>;
	pendingpay2(options?: GetTableRowsOptions): Promise<TableRowsResult<DaccustodianPendingpay2>>;
	pendingstake(options?: GetTableRowsOptions): Promise<TableRowsResult<DaccustodianPendingstake>>;
	state(options?: GetTableRowsOptions): Promise<TableRowsResult<DaccustodianState>>;
	votes(options?: GetTableRowsOptions): Promise<TableRowsResult<DaccustodianVotes>>;
}

