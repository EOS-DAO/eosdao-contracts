// =====================================================
// WARNING: GENERATED FILE
//
// Any changes you make will be overwritten by Lamington
// =====================================================

import { Account, Contract, GetTableRowsOptions, TableRowsResult } from 'lamington';

// Table row types
export interface DacdirectoryDacs {
	owner: string|number;
	dac_id: string|number;
	title: string;
	symbol: string;
	refs: Array<string>;
	accounts: Array<string>;
	dac_state: number;
}

export interface Dacdirectory extends Contract {
	// Actions
	regaccount(dac_id: string|number, account: string|number, type: number, options?: { from?: Account }): Promise<any>;
	regdac(owner: string|number, dac_id: string|number, dac_symbol: any, title: string, refs: any, accounts: any, options?: { from?: Account }): Promise<any>;
	regref(dac_id: string|number, value: string, type: number, options?: { from?: Account }): Promise<any>;
	setowner(dac_id: string|number, new_owner: string|number, options?: { from?: Account }): Promise<any>;
	setstatus(dac_id: string|number, value: number, options?: { from?: Account }): Promise<any>;
	unregaccount(dac_id: string|number, type: number, options?: { from?: Account }): Promise<any>;
	unregdac(dac_id: string|number, options?: { from?: Account }): Promise<any>;
	unregref(dac_id: string|number, type: number, options?: { from?: Account }): Promise<any>;
	
	// Tables
	dacs(options?: GetTableRowsOptions): Promise<TableRowsResult<DacdirectoryDacs>>;
}

