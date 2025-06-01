import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transferData, setTransferData] = useState({
    amount: "",
    receiver_account: "",
    description: "",
  });
  const [newAccountData, setNewAccountData] = useState({
    currency: "USD",
    account_limit: 10000,
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchUserData(token);
    fetchAccounts(token);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAccounts = async (token) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accounts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accounts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAccountData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create account");
      }

      await fetchAccounts(token);
      setShowCreateAccount(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTransfer = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transfers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...transferData,
            amount: parseInt(transferData.amount),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to process transfer");
      }

      await fetchAccounts(token);
      setShowTransfer(false);
      setTransferData({
        amount: "",
        receiver_account: "",
        description: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="ml-2 text-xl font-bold text-white">
                  SecureBank
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-150"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-300">
            Manage your accounts and transactions securely
          </p>
        </div>

        {/* Accounts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-colors duration-150"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Account #{account.account_number}
                  </h3>
                  <p className="text-sm text-gray-400">{account.currency}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    account.status
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {account.status ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold text-white">
                  {account.currency} {account.balance.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Available Balance</p>
                <p className="text-sm text-gray-400 mt-1">
                  Limit: {account.currency}{" "}
                  {account.account_limit.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedAccount(account);
                    setShowTransfer(true);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-150"
                >
                  Transfer
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-150">
                  Details
                </button>
              </div>
            </div>
          ))}

          {/* Create New Account Card */}
          <div
            onClick={() => setShowCreateAccount(true)}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-dashed border-white/20 hover:border-blue-500/50 transition-colors duration-150 cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Create New Account
            </h3>
            <p className="text-sm text-gray-400 text-center">
              Open a new account with your preferred currency
            </p>
          </div>
        </div>
      </main>

      {/* Create Account Modal */}
      {showCreateAccount && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">
              Create New Account
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Currency
                </label>
                <select
                  value={newAccountData.currency}
                  onChange={(e) =>
                    setNewAccountData({
                      ...newAccountData,
                      currency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Limit
                </label>
                <input
                  type="number"
                  value={newAccountData.account_limit}
                  onChange={(e) =>
                    setNewAccountData({
                      ...newAccountData,
                      account_limit: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter account limit"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateAccount(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAccount}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">
              Transfer Money
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  From Account
                </label>
                <input
                  type="text"
                  value={`Account #${selectedAccount.account_number} (${selectedAccount.currency} ${selectedAccount.balance})`}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  To Account Number
                </label>
                <input
                  type="number"
                  value={transferData.receiver_account}
                  onChange={(e) =>
                    setTransferData({
                      ...transferData,
                      receiver_account: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter receiver's account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={transferData.amount}
                  onChange={(e) =>
                    setTransferData({ ...transferData, amount: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter amount in ${selectedAccount.currency}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={transferData.description}
                  onChange={(e) =>
                    setTransferData({
                      ...transferData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter transfer description"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowTransfer(false);
                    setSelectedAccount(null);
                    setTransferData({
                      amount: "",
                      receiver_account: "",
                      description: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
