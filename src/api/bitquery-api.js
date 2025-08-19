import axios from "axios";

let data = {
   "query": "",
   "variables": "{}"
};

let config = {
   method: 'post',
   maxBodyLength: Infinity,
   url: 'https://streaming.bitquery.io/graphql',
   headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer <Bitquery Access Token>'
   },
   data : data
};

export const getTotalAssets = async (addresses) => {
    let query = `
    {
        EVM(dataset: combined, network: eth) {
            BalanceUpdates(
            where: {BalanceUpdate: {Address: {in: ${addresses}}}, Currency: {SmartContract: {is: "0x"}}}
            ) {
            balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
            }
        }
    }
    `;
    config.data.query = query;
    // console.log(config);

    const response = await axios.request(config);
    const result = response.data.data.EVM.BalanceUpdates[0].balance;
    // console.log(result);
    return result;
}

export const getStats = async (address) => {
    let query = `
    query MyQuery {
        EVM(dataset: combined) {
            tokens: BalanceUpdates(
            where: {BalanceUpdate: {Address: {is: "${address}"}}}
            ) {
            uniq(of: Currency_SmartContract)
            }
            balance: BalanceUpdates(
            where: {BalanceUpdate: {Address: {is: "${address}"}}, Currency: {SmartContract: {is: "0x"}}}
            ) {
            sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
            }
            transactions: Transactions(
            where: {TransactionStatus: {Success: true}, Transaction: {From: {is: "${address}"}}}
            ){
            count
            }
            lastTransaction: Transactions(
            where: {TransactionStatus: {Success: true}, Transaction: {From: {is: "${address}"}}}
            ){
            Block{
                Date(maximum: Block_Date)
            }
            }
        }
    }
    `;
    config.data.query = query;

    const response = await axios.request(config);

    // console.log(response.data);

    const balance = response.data.data.EVM.balance[0].sum;
    const token = response.data.data.EVM.tokens[0].uniq;
    const transactionRecord = response.data.data.EVM.transactions[0].count;
    const lastTransaction = response.data.data.EVM.lastTransaction[0].Block.Date;

    return {balance, token, transactionRecord, lastTransaction};
}

export const getRecentTransactions = async (addresses) => {
    let query = `
    query MyQuery {
        EVM {
            Transfers(
                where: {Transfer: {Sender: {in: ${addresses}}, Currency: {SmartContract: {is: "0x"}}}}
                orderBy: {descending: Block_Time}
                limit: {count:10}
            ) {
            Block {
                Time
                Number
            }
            Transfer {
                Amount
                Sender
                Receiver
                Success
            }
            Transaction {
                Hash
                Gas
            }
            }
        }
    }
    `;
    config.data.query = query;

    const response = await axios.request(config);
    const result = response.data.data.EVM.Transfers;

    return result;
}

export const getTransactionHistory = async (address) => {
    let query = `
    query MyQuery {
        EVM(dataset: combined) {
            Transfers(
            where: {Transfer: {Sender: {is: "${address}"}}}
            orderBy: {descending: Block_Time}
            limit: {count:10}
            ) {
            Block {
                Time
                Number
            }
            Transfer {
                Amount
                Sender
                Receiver
                Success
            }
            Transaction {
                Hash
                GasPrice
            }
            }
        }
    }
    `;
    config.data.query = query;

    const response = await axios.request(config);
    const result = response.data.data.EVM.Transfers;

    return result;
}

export const getHoldings = async (address) => {
    let query = `
    query MyQuery {
        EVM(dataset: combined) {
            BalanceUpdates(
            where: {BalanceUpdate: {Address: {is: "${address}"}}}
            ) {
            Currency {
                Name
                Symbol
                SmartContract
                Decimals
            }
            balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
            usd: sum(of: BalanceUpdate_AmountInUSD, selectWhere: {gt: "0"})
            }
        }
    }
    `;
    config.data.query = query;

    let response = await axios.request(config);
    let result = response.data.data.EVM.BalanceUpdates;

    return result;
};
