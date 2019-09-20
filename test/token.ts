// =====================================================
// WARNING: GENERATED FILE
//
// Any changes you make will be overwritten by Lamington
// =====================================================
/*
Has to be manual because spec generator does not handle external tables
 */

import { Account, Contract, GetTableRowsOptions, TableRowsResult } from 'lamington';

// Table row types
export interface TokenAccounts {
	balance: string;
}

export interface TokenMembers {
    sender: string|number;
    agreedtermsversion: number;
}

export interface TokenMemterms {
	terms: string;
	hash: string;
	version: number;
}

export interface TokenStat {
	supply: string;
	max_supply: string;
	issuer: string|number;
}

export interface Token extends Contract {
	// Actions
	create(issuer: string|number, maximum_supply: string, options?: { from?: Account }): Promise<any>;
	issue(to: string|number, quantity: string, memo: string, options?: { from?: Account }): Promise<any>;
	memberrege(sender: string|number, agreedterms: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	newmemtermse(terms: string, hash: string, dac_id: string|number, options?: { from?: Account }): Promise<any>;
	transfer(from: string|number, to: string|number, quantity: string, memo: string, options?: { from?: Account }): Promise<any>;
	
	// Tables
	accounts(options?: GetTableRowsOptions): Promise<TableRowsResult<TokenAccounts>>;
	members(options?: GetTableRowsOptions): Promise<TableRowsResult<TokenMembers>>;
	memterms(options?: GetTableRowsOptions): Promise<TableRowsResult<TokenMemterms>>;
	stat(options?: GetTableRowsOptions): Promise<TableRowsResult<TokenStat>>;
}

