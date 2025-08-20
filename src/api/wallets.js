const defaultWallets = [
    {
      id: "1",
      address: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6",
      blockchain: "Ethereum",
      caseId: "CPIB-2024-001",
      balance: 0,
      lastActivity: "",
      dateAdded: "2024-01-15",
      status: "active",
      dateSeized: "2024-01-15",
    },
    {
      id: "2",
      address: "0x8C8D7C46219D9205f056f28fee5950aD564d7465",
      blockchain: "Ethereum",
      caseId: "CPIB-2024-002",
      balance: 0,
      lastActivity: "",
      dateAdded: "2024-01-15",
      status: "active",
      dateSeized: "2024-01-18",
    },
  ];

const seizedAssets = [
    {
      id: "1",
      cryptocurrency: "Ethereum",
      amount: "0",
      usdValue: 0,
      address: "0xcf1DC766Fc2c62bef0b67A8De666c8e67aCf35f6",
      caseId: "CPIB-2024-001",
      status: "secured",
      dateSeized: "2024-01-15",
      location: "Singapore",
      priceChange24h: 2.3
    },
    {
      id: "2",
      cryptocurrency: "Ethereum",
      amount: "0",
      usdValue: 0,
      address: "0x8C8D7C46219D9205f056f28fee5950aD564d7465",
      caseId: "CPIB-2024-002",
      status: "secured",
      dateSeized: "2024-01-18",
      location: "Singapore",
      priceChange24h: -1.2
    },
]
  // Initialize localStorage if empty
  if (!localStorage.getItem("wallets")) {
    localStorage.setItem("wallets", JSON.stringify(defaultWallets));
  }

  if(!localStorage.getItem("assets")){
    localStorage.setItem("assets",JSON.stringify(seizedAssets));
  }  
  // Get all wallets
  export const getWallets = () => {
    return JSON.parse(localStorage.getItem("wallets") || "[]");
  };

  export const getAssets = () => {
    return JSON.parse(localStorage.getItem("assets") || "[]");
  }
  
  // Add a new wallet
  export const addWallet = ({ address, caseId }) => {
    const wallets = getWallets();
    const assets = getAssets();
  
    const newWallet = {
      id: (wallets.length + 1).toString(),
      address,
      blockchain: "Ethereum",
      caseId,
      balance: 0,
      lastActivity: "",
      dateAdded: "2024-01-15",
      status: "active",
      dateSeized: "2024-01-18",
    };

    const newAsset = {
      id: (seizedAssets.length + 1).toString(),
      cryptocurrency: "Ethereum",
      amount: "0",
      usdValue: 106234.67,
      address: address,
      caseId: caseId,
      status: "secured",
      dateSeized: "2024-01-18",
      location: "Singapore",
      priceChange24h: -1.2
    };
  
    wallets.push(newWallet);
    seizedAssets.push(newAsset);
    localStorage.setItem("wallets", JSON.stringify(wallets));
    localStorage.setItem("assets", JSON.stringify(assets));
    return newWallet;
  };