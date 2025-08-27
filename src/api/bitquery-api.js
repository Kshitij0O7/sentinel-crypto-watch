import axios from "axios";
import apiCache from "./cache.js";

const apiKey = import.meta.env.VITE_API_KEY;
let data = {
  query: "",
  variables: "{}",
};

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://streaming.bitquery.io/graphql",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${apiKey}`
    // Authorization: `Bearer ory_at_`,
  },
  data: data,
};

export const getTotalAssets = async (addresses) => {
    const cacheKey = `totalAssets_${addresses}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

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

    try {
        const response = await axios.request(config);
        const result = response.data.data.EVM.BalanceUpdates?.[0]?.balance || "0";
        apiCache.set(cacheKey, result, 2 * 60 * 1000); // Cache for 2 minutes
        return result;
    } catch (error) {
        console.error("Error fetching total assets:", error);
        return "0";
    }
};

export const getWalletBalance = async (address) => {
  const cacheKey = `balance_${address}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  let query = `
    query GetWalletBalance {
      EVM(dataset: combined) {
        balance: BalanceUpdates(
          where: {BalanceUpdate: {Address: {is: "${address}"}}, Currency: {SmartContract: {is: "0x"}}}
        ) {
          sum(of: BalanceUpdate_Amount, selectWhere: {gt: "0"})
          usd: sum(of: BalanceUpdate_AmountInUSD, selectWhere: {gt: "0"})
        }
      }
    }
  `;
  config.data.query = query;

  try {
    const response = await axios.request(config);
    const result = {
      balance: response.data.data.EVM.balance[0]?.sum || "0",
      usd: response.data.data.EVM.balance[0]?.usd || "0"
    };
    apiCache.set(cacheKey, result, 3 * 60 * 1000); // Cache for 3 minutes
    return result;
  } catch (error) {
    console.error("Could not get wallet balance:", error);
    return { balance: "0", usd: "0" };
  }
};

export const getWalletTokens = async (address) => {
  const cacheKey = `tokens_${address}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  let query = `
    query GetWalletTokens {
      EVM(dataset: combined) {
        tokens: BalanceUpdates(
          where: {BalanceUpdate: {Address: {is: "${address}"}}}
        ) {
          uniq(of: Currency_SmartContract)
        }
      }
    }
  `;
  config.data.query = query;

  try {
    const response = await axios.request(config);
    const result = response.data.data.EVM.tokens[0]?.uniq || 0;
    apiCache.set(cacheKey, result, 5 * 60 * 1000); // Cache for 5 minutes
    return result;
  } catch (error) {
    console.error("Could not get wallet tokens:", error);
    return 0;
  }
};

export const getWalletTransactionCount = async (address) => {
  const cacheKey = `txCount_${address}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  let query = `
    query GetWalletTransactionCount {
      EVM(dataset: combined) {
        transactions: Transactions(
          where: {TransactionStatus: {Success: true}, Transaction: {From: {is: "${address}"}}}
        ) {
          count
        }
      }
    }
  `;
  config.data.query = query;

  try {
    const response = await axios.request(config);
    const result = response.data.data.EVM.transactions[0]?.count || 0;
    apiCache.set(cacheKey, result, 2 * 60 * 1000); // Cache for 2 minutes
    return result;
  } catch (error) {
    console.error("Could not get wallet transaction count:", error);
    return 0;
  }
};

export const getWalletLastActivity = async (address) => {
  const cacheKey = `lastActivity_${address}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  let query = `
    query GetWalletLastActivity {
      EVM(dataset: combined) {
        lastTransaction: Transactions(
          where: {TransactionStatus: {Success: true}, Transaction: {From: {is: "${address}"}}}
        ) {
          Block {
            Date(maximum: Block_Date)
          }
        }
      }
    }
  `;
  config.data.query = query;

  try {
    const response = await axios.request(config);
    const result = response.data.data.EVM.lastTransaction[0]?.Block?.Date || "";
    apiCache.set(cacheKey, result, 1 * 60 * 1000); // Cache for 1 minute
    return result;
  } catch (error) {
    console.error("Could not get wallet last activity:", error);
    return "";
  }
};



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
};

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
};

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

export const getAllWalletTransactions = async (address) => {
  const cacheKey = `allTransactions_${address}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  let query = `
    query MyQuery {
        EVM(dataset: combined, network: eth) {
            # Native ETH transfers
            nativeTransfers: Transfers(
                where: {
                    or: [
                        {Transfer: {Sender: {is: "${address}"}}},
                        {Transfer: {Receiver: {is: "${address}"}}}
                    ]
                    Transfer: {Currency: {SmartContract: {is: "0x"}}}
                }
                orderBy: {descending: Block_Time}
                limit: {count:50}
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
                    Currency {
                        Symbol
                        SmartContract
                        Decimals
                    }
                }
                Transaction {
                    Hash
                    GasPrice
                }
            }
            
            # ERC-20 token transfers
            tokenTransfers: Transfers(
                where: {
                    or: [
                        {Transfer: {Sender: {is: "${address}"}}},
                        {Transfer: {Receiver: {is: "${address}"}}}
                    ]
                    Transfer: {Currency: {SmartContract: {not: "0x"}}}
                }
                orderBy: {descending: Block_Time}
                limit: {count:50}
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
                    Currency {
                        Symbol
                        SmartContract
                        Decimals
                    }
                }
                Transaction {
                    Hash
                    GasPrice
                }
            }
            
            # Contract interactions
            contractInteractions: Transactions(
                where: {
                    or: [
                        {Transaction: {From: {is: "${address}"}}},
                        {Transaction: {To: {is: "${address}"}}}
                    ]
                    Transaction: {To: {not: "0x"}}
                }
                orderBy: {descending: Block_Time}
                limit: {count:30}
            ) {
                Block {
                    Time
                    Number
                }
                Transaction {
                    Hash
                    From
                    To
                    GasPrice
                    GasUsed
                    Status
                }
            }
        }
    }
    `;
  
  config.data.query = query;

  try {
    const response = await axios.request(config);
    const data = response.data.data.EVM;
    
    // Combine and format all transaction types
    const allTransactions = [
      ...(data.nativeTransfers || []).map(tx => ({
        ...tx,
        type: 'native_transfer',
        currency: 'ETH'
      })),
      ...(data.tokenTransfers || []).map(tx => ({
        ...tx,
        type: 'token_transfer',
        currency: tx.Transfer.Currency.Symbol || 'Unknown Token'
      })),
      ...(data.contractInteractions || []).map(tx => ({
        ...tx,
        type: 'contract_interaction',
        currency: 'Contract Call'
      }))
    ];
    
    // Sort by timestamp (newest first)
    const sortedTransactions = allTransactions.sort((a, b) => 
      new Date(b.Block.Time) - new Date(a.Block.Time)
    );
    
    // Cache for 2 minutes
    apiCache.set(cacheKey, sortedTransactions, 2 * 60 * 1000);
    
    return sortedTransactions;
  } catch (error) {
    console.error("Error fetching all wallet transactions:", error);
    return [];
  }
};
