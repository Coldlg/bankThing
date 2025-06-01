import Head from "next/head";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>BankApp - Home</title>
        <meta name="description" content="Your personal banking app" />
      </Head>

      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">BankApp</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="/profile" className="hover:text-gray-300">
                  Profile
                </a>
              </li>
              <li>
                <a href="/transactions" className="hover:text-gray-300">
                  Transactions
                </a>
              </li>
              <li>
                <a href="/settings" className="hover:text-gray-300">
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Account Balance */}
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Account Balance
            </h2>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-green-600">$5,230.45</h3>
              <p className="text-gray-500 mt-2">Available Balance</p>
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Recent Transactions
            </h2>
            <ul>
              <li className="border-b py-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-800">Payment from John</p>
                  <small className="text-gray-500 text-sm">2025-05-20</small>
                </div>
                <span className="text-green-500">+$500.00</span>
              </li>
              <li className="border-b py-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-800">Payment to Amazon</p>
                  <small className="text-gray-500 text-sm">2025-05-18</small>
                </div>
                <span className="text-red-500">-$45.30</span>
              </li>
              <li className="border-b py-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-800">Grocery Store</p>
                  <small className="text-gray-500 text-sm">2025-05-15</small>
                </div>
                <span className="text-red-500">-$75.50</span>
              </li>
            </ul>
          </section>

          {/* Quick Links */}
          <section className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Quick Links
            </h2>
            <ul>
              <li className="py-2">
                <a href="/transfer" className="text-blue-600 hover:underline">
                  Transfer Money
                </a>
              </li>
              <li className="py-2">
                <a href="/pay-bills" className="text-blue-600 hover:underline">
                  Pay Bills
                </a>
              </li>
              <li className="py-2">
                <a href="/settings" className="text-blue-600 hover:underline">
                  Settings
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-4">
        <p>&copy; 2025 BankApp. All rights reserved.</p>
      </footer>
    </div>
  );
}
