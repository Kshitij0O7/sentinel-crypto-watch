/*
TO ADD :-

1. getCases()
2. getCase(caseId:String);
3. AddCase(case:CaseObject);
4. UpdateCase(case:CaseObject); -> to be used when we are adding address to a case
5. DeleteCase(caseId:string);

// Case Object(With Mock Data):
{
      id: "1",
      name: "Crypto Fraud Investigation Alpha",
      caseId: "CPIB-2024-001",
      description: "Investigation into suspected cryptocurrency fraud involving multiple wallets and exchanges.",
      createdDate: "2024-01-15",
      dateAdded: "2024-01-15",
      status: "active",
      investigator: "Detective Lim Wei Ming",
      totalValue: "0",
      currency: "ETH",
      alertGroupId: "1",
      addresses: [
        {
          id: "1",
          address: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6",
          blockchain: "Ethereum",
          privateLabel: "Suspect Primary Wallet",
          dateSeized: "2024-01-15",
          dateAdded: "2024-01-15",
          balance: "0",
          lastActivity: ""
        },
        {
          id: "2", 
          address: "0x8C8D7C46219D9205f056f28fee5950aD564d7465",
          blockchain: "Ethereum",
          privateLabel: "Secondary Wallet",
          dateSeized: "2024-01-16",
          dateAdded: "2024-01-16",
          balance: "0",
          lastActivity: ""
        }
      ],
      recentTransactions: [],
      alerts: [
        {
          id: "1",
          type: "large_transaction",
          message: "Large outgoing transaction detected",
          amount: "5.0000 ETH",
          timestamp: "2024-01-20 14:23:15",
          status: "new"
        },
        {
          id: "2",
          type: "new_address",
          message: "Transaction to previously unseen address",
          timestamp: "2024-01-19 16:45:30",
          status: "acknowledged"
        }
      ]
    },
*/

const defaultCases = [
    {
      id: "1",
      name: "Crypto Fraud Investigation Alpha",
      caseId: "CPIB-2024-001",
      description: "Investigation into suspected cryptocurrency fraud involving multiple wallets and exchanges.",
      createdDate: "2024-01-15",
      dateAdded: "2024-01-15",
      status: "active",
      investigator: "Detective Lim Wei Ming",
      totalValue: "0",
      currency: "ETH",
      alertGroupId: "1",
      addresses: [
        {
          id: "1",
          address: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6",
          blockchain: "Ethereum",
          privateLabel: "Suspect Primary Wallet",
          dateSeized: "2024-01-15",
          dateAdded: "2024-01-15",
          balance: "0",
          lastActivity: ""
        },
        {
          id: "2", 
          address: "0x8C8D7C46219D9205f056f28fee5950aD564d7465",
          blockchain: "Ethereum",
          privateLabel: "Secondary Wallet",
          dateSeized: "2024-01-16",
          dateAdded: "2024-01-16",
          balance: "0",
          lastActivity: ""
        }
      ],
      recentTransactions: [],
      alerts: [
        {
          id: "1",
          type: "large_transaction",
          message: "Large outgoing transaction detected",
          amount: "5.0000 ETH",
          timestamp: "2024-01-20 14:23:15",
          status: "new"
        },
        {
          id: "2",
          type: "new_address",
          message: "Transaction to previously unseen address",
          timestamp: "2024-01-19 16:45:30",
          status: "acknowledged"
        }
      ]
    },
    {
      id: "2",
      name: "Money Laundering Case Beta", 
      caseId: "CPIB-2024-002",
      description: "Complex money laundering scheme involving DeFi protocols and multiple blockchain networks.",
      createdDate: "2024-01-18",
      dateAdded: "2024-01-18",
      status: "under_review",
      investigator: "Detective Sarah Chen",
      totalValue: "0",
      currency: "ETH",
      alertGroupId: "2",
      addresses: [
        {
          id: "1",
          address: "0x8C8D7C46219D9205f056f28fee5950aD564d7465",
          blockchain: "Ethereum",
          privateLabel: "Exchange Deposit Wallet",
          dateSeized: "2024-01-18",
          dateAdded: "2024-01-18",
          balance: "0",
          lastActivity: ""
        }
      ],
      recentTransactions: [],
      alerts: [
        {
          id: "1",
          type: "defi_interaction",
          message: "DeFi protocol interaction detected",
          timestamp: "2024-01-21 10:30:45",
          status: "new"
        }
      ]
    }
];
  
  // -------------------- INITIALIZE LOCAL STORAGE --------------------
if (!localStorage.getItem("cases")) {
localStorage.setItem("cases", JSON.stringify(defaultCases));
}

// -------------------- CASE API --------------------

// Get all cases
export function getCases() {
return JSON.parse(localStorage.getItem("cases") || "[]");
}

// Get single case by caseId
export function getCase(caseId) {
const cases = getCases();
return cases.find(c => c.caseId === caseId);
}

// Add a new case
export function addCase(newCase) {
const cases = getCases();
cases.push(newCase);
localStorage.setItem("cases", JSON.stringify(cases));
}

// Update an existing case
export function updateCase(updatedCase) {
let cases = getCases();
cases = cases.map(c => (c.caseId === updatedCase.caseId ? updatedCase : c));
localStorage.setItem("cases", JSON.stringify(cases));
}

// Delete a case by caseId
export function deleteCase(caseId) {
let cases = getCases();
cases = cases.filter(c => c.caseId !== caseId);
localStorage.setItem("cases", JSON.stringify(cases));
}