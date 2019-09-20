import {
    Account,
    AccountManager,
    ContractDeployer,
    assertEOSError,
    assertRowsEqual,
    assertRowCount,
    untilBlocknumber,
    nextBlock,
    sleep,
    EOSManager,
    generateTypes
} from "lamington";
import { Donation } from "../contracts/donation/donation";
import { Voting } from "../contracts/voting/voting";
import { Token } from "../contracts/token/token";
import { Dacdirectory } from "./dacdirectory";
import { Daccustodian } from "./daccustodian";
import { EosioToken } from "../contracts/eosio.token/eosio.token";
import { custodian_config } from "./config/daccustodian"
import * as fs from "fs";
import * as path from "path";


describe("EOS DAO Donation Contract", function() {
    let donation_contract: Donation, voting_contract: Voting, dao_token_contract: Token, directory_contract: Dacdirectory,
        custodian_contract: Daccustodian;
    let token_contract: EosioToken, fake_token_contract: EosioToken;
    let token_account: Account, fake_token_account: Account, dao_token_account: Account, donation_account: Account,
        voting_account: Account, custodian_account: Account, directory_account: Account, auth_account: Account;
    let donor1: Account, donor2: Account;
    let dac_id: string;

    async function setup_external(name: string){
        const contracts_dir = path.normalize(`${__dirname}/../contracts/${name}`);
        const compiled_dir = path.normalize(`${__dirname}/../.lamington/compiled_contracts/contracts/${name}`);
        if (!fs.existsSync(contracts_dir)){
            fs.mkdirSync(contracts_dir);
        }
        if (!fs.existsSync(compiled_dir)){
            fs.mkdirSync(compiled_dir);
        }

        fs.copyFileSync(`${__dirname}/external_contracts/${name}.wasm`, `${compiled_dir}/${name}.wasm`);
        fs.copyFileSync(`${__dirname}/external_contracts/${name}.abi`, `${compiled_dir}/${name}.abi`);

        await generateTypes(`contracts/${name}/${name}`);
    }

    async function new_account(name: string){
        const act = new Account(
            name,
            '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
        );
        await AccountManager.setupAccount(act);
        return act;
    }

    async function setup_token(tc: EosioToken, ta: Account){
        // console.log(`Setting up token ${ta.name}`);
        await tc.create(ta.name, "10000000000.0000 EOS", { from: ta });
        await tc.issue(ta.name, "100000000.0000 EOS", "Woot", { from: ta });
        await tc.transfer(ta.name, donor1.name, "10000.0000 EOS", "new money", { from: ta });
        await tc.transfer(ta.name, donor2.name, "10000.0000 EOS", "new money", { from: ta });
    }

    async function create_dao_accounts(){
        donation_account = await new_account('donation.dao');
        dao_token_account = await new_account('token.dao');
        voting_account = await new_account('voting.dao');
        auth_account = await new_account('auth.dao');
        custodian_account = await new_account('daccustodian');
        directory_account = await new_account('dacdirectory');
    }

    async function add_token_contract_permissions(){
        EOSManager.addSigningAccountIfMissing(dao_token_account);

        // Append the `eosio.code` permission to existing
        const required_auth_d: any = {
            threshold: 1,
            accounts: [{
                permission: { actor: donation_account.name, permission: 'eosio.code' },
                weight: 1,
            }],
            keys: [],
            waits: []
        };
        const required_auth_t: any = {
            threshold: 1,
            accounts: [{
                permission: { actor: dao_token_account.name, permission: 'eosio.code' },
                weight: 1,
            }],
            keys: [],
            waits: []
        };
        // Construct the update actions
        const actions: any = [
            {
                account: 'eosio',
                name: 'updateauth',
                authorization: dao_token_account.active,
                data: {
                    account: dao_token_account.name,
                    permission: 'issue',
                    parent: 'active',
                    auth: required_auth_d,
                },
            },
            {
                account: 'eosio',
                name: 'updateauth',
                authorization: dao_token_account.active,
                data: {
                    account: dao_token_account.name,
                    permission: 'notify',
                    parent: 'active',
                    auth: required_auth_t,
                },
            },
            {
                account: 'eosio',
                name: 'updateauth',
                authorization: dao_token_account.active,
                data: {
                    account: dao_token_account.name,
                    permission: 'xfer',
                    parent: 'active',
                    auth: required_auth_t,
                },
            },
        ];
        const link_actions: any = [
            {
                account: 'eosio',
                name: 'linkauth',
                authorization: dao_token_account.active,
                data: {
                    account: dao_token_account.name,
                    code: dao_token_account.name,
                    type: 'issue',
                    requirement: 'issue',
                },
            },
            {
                account: 'eosio',
                name: 'linkauth',
                authorization: dao_token_account.active,
                data: {
                    account: dao_token_account.name,
                    code: custodian_account.name,
                    type: 'weightobsv',
                    requirement: 'notify',
                },
            },
            {
                account: 'eosio',
                name: 'linkauth',
                authorization: dao_token_account.active,
                data: {
                    account: dao_token_account.name,
                    code: voting_account.name,
                    type: 'balanceobsv',
                    requirement: 'notify',
                },
            },
            {
                account: 'eosio',
                name: 'linkauth',
                authorization: dao_token_account.active,
                data: {
                    account: dao_token_account.name,
                    code: dao_token_account.name,
                    type: 'transfer',
                    requirement: 'xfer',
                },
            },
        ];
        // Execute the transaction actions
        await EOSManager.transact({ actions });
        await EOSManager.transact({ actions: link_actions });
        nextBlock();
    }

    async function add_voting_contract_permissions(){
        EOSManager.addSigningAccountIfMissing(voting_account);

        // Append the `eosio.code` permission to existing
        const required_auth: any = {
            threshold: 1,
            accounts: [{
                permission: { actor: voting_account.name, permission: 'eosio.code' },
                weight: 1,
            }],
            keys: [],
            waits: []
        };
        const actions: any = [
            {
                account: 'eosio',
                name: 'updateauth',
                authorization: voting_account.active,
                data: {
                    account: voting_account.name,
                    permission: 'notify',
                    parent: 'active',
                    auth: required_auth,
                },
            },
        ];

        const link_actions: any = [
            {
                account: 'eosio',
                name: 'linkauth',
                authorization: voting_account.active,
                data: {
                    account: voting_account.name,
                    code: custodian_account.name,
                    type: 'balanceobsv',
                    requirement: 'notify',
                },
            },
            {
                account: 'eosio',
                name: 'linkauth',
                authorization: voting_account.active,
                data: {
                    account: voting_account.name,
                    code: custodian_account.name,
                    type: 'weightobsv',
                    requirement: 'notify',
                },
            },
        ];
        // Execute the transaction actions
        await EOSManager.transact({ actions });
        await EOSManager.transact({ actions: link_actions });
        nextBlock();
    }

    async function add_directory(){
        await directory_contract.regdac(auth_account.name, dac_id, {"contract":dao_token_account.name, "symbol":"4,DAO"}, "EOS DAO", [], [], {from:auth_account});
        nextBlock();
        await directory_contract.regaccount(dac_id, auth_account.name, 0, {from:auth_account});
        await directory_contract.regaccount(dac_id, custodian_account.name, 2, {from:auth_account});
        await directory_contract.regaccount(dac_id, voting_account.name, 8, {from:auth_account});
        nextBlock();
    }

    before(async function() {
        EOSManager.initWithDefaults();
        dac_id = "eosdao";

        // // Copy compiled system contracts to compiled_contracts folder so we can load without having to compile
        await setup_external('eosio.token');
        await setup_external('dacdirectory');
        await setup_external('daccustodian');

        donor1 = await AccountManager.createAccount();
        donor2 = await AccountManager.createAccount();
        // console.log(`Created donor accounts ${donor1.name}, ${donor2.name}`);
        token_account = await new_account('eosio.token');
        fake_token_account = await new_account('thistokenbad');

        await create_dao_accounts();

        // setup token
        token_contract = await ContractDeployer.deployToAccount("contracts/eosio.token/eosio.token", token_account);
        await setup_token(token_contract, token_account);
        await sleep(1500);

        // // fake token
        fake_token_contract = await ContractDeployer.deployToAccount("contracts/eosio.token/eosio.token", fake_token_account);
        await setup_token(fake_token_contract, fake_token_account);
        // await sleep(1500);

        // setup dacdirectory
        directory_contract = await ContractDeployer.deployToAccount("contracts/dacdirectory/dacdirectory", directory_account);
        await add_directory();

        // setup daccustodian
        custodian_contract = await ContractDeployer.deployToAccount("contracts/daccustodian/daccustodian", custodian_account);
        custodian_contract.updateconfige(custodian_config, "eosdao", { from: auth_account });

        donation_contract = await ContractDeployer.deployToAccount("contracts/donation/donation", donation_account);
        voting_contract = await ContractDeployer.deployToAccount("contracts/voting/voting", voting_account);
        dao_token_contract = await ContractDeployer.deployToAccount("contracts/token/token", dao_token_account);
        await dao_token_contract.create(dao_token_account.name, "10000000000.0000 DAO", { from: dao_token_account });

        await add_token_contract_permissions();
        // console.log(`added token perms`);
        await add_voting_contract_permissions();
        // console.log(`added voting perms`);

        nextBlock();
    });

    beforeEach(async function() {
    });




    // donation contract
    it("Donate to the DAO", async function() {
        await token_contract.transfer(donor1.name, donation_account.name, "100.0000 EOS", 'For the DAO!', { from: donor1 });

        const res: any = dao_token_contract.getTableRows('accounts', {scope:donor1.name, limit:1});
        assertRowsEqual(res, [ { balance: '100.0000 DAO' } ]);
    });

    it("Transfer from fake EOS contract doesn't award DAO tokens", async function() {
        await fake_token_contract.transfer(donor2.name, donation_account.name, "21.0000 EOS", "Fake EOS", { from: donor2 });

        const res: any = dao_token_contract.getTableRows('accounts', {scope:donor2.name, limit:1});
        await assertRowCount(res, 0);
    });

    it("Below minimum donation of 1.0000 EOS", async function() {
        assertEOSError(
            token_contract.transfer(donor2.name, donation_account.name, "0.9999 EOS", "Below Minimum", { from: donor2 }),
            "eosio_assert_message_exception",
            "Minimum donation asserts"
        );
    });

    // token contract
    it("Require from address to authenticate", async function() {
        assertEOSError(
            token_contract.transfer(donor1.name, donor2.name, "50.0000 DAO", "Missing auth", { from: donor2 }),
            "missing_auth_exception",
            "Attempt to transfer tokens without authentication asserts"
        );
    });

    it("Cannot transfer DAO tokens", async function() {
        assertEOSError(
            token_contract.transfer(donor1.name, donor2.name, "50.0000 DAO", "Transfer not allowed", { from: donor1 }),
            "eosio_assert_message_exception",
            "Attempt to transfer tokens asserts"
        );
    });

    it("Registering as a member", async function() {

        let terms_hash: string = '1df37bdb72c0be963ef2bdfe9b7ef10b';
        const terms_url: string = 'https://raw.githubusercontent.com/eosdac/eosdac-constitution/master/boilerplate_constitution.md';
        const terms_incorrect = '19254f2be00396b63c713e5b06e7dd36';

        await dao_token_contract.newmemtermse(terms_url, terms_hash, dac_id, { from: auth_account });

        assertEOSError(
            dao_token_contract.memberrege(donor1.name, terms_hash, dac_id, { from: donor1 }),
            "eosio_assert_message_exception",
            "Attempt to register with no hash asserts"
        );


        assertEOSError(
            dao_token_contract.memberrege(donor1.name, terms_hash, dac_id, { from: donor1 }),
            "eosio_assert_message_exception",
            "Attempt to register with no member terms configured asserts"
        );


        assertEOSError(
            dao_token_contract.memberrege(donor1.name, terms_incorrect, dac_id, { from: donor1 }),
            "eosio_assert_message_exception",
            "Attempt to register with incorrect hash asserts"
        );

        // registration should succeed
        await dao_token_contract.memberrege(donor1.name, terms_hash, dac_id, { from: donor1 });

    });

});
