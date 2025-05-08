'use client';

export default function Whitepaper() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500">
            TIRP Whitepaper
          </h1>
          <p className="text-xl mt-4 text-gray-400">Version 0.0.1 (Not Peer Reviewed)</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-red-500/20 p-6 rounded-xl mb-12 border-2 border-red-500">
          <p className="text-xl text-center">
            ⚠️ This whitepaper is a work of satire. Do not take anything seriously. ⚠️
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-800/50 p-6 rounded-xl mb-12">
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">Table of Contents</h2>
          <ul className="space-y-2">
            <li>1. Introduction (Why We're Probably Going to Rug Pull)</li>
            <li>2. Tokenomics (How We'll Take Your Money)</li>
            <li>3. Anti-Whale Mechanism (Because We're the Only Whales Allowed)</li>
            <li>4. Roadmap (To Zero)</li>
            <li>5. Team (Anonymous for Obvious Reasons)</li>
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {/* Introduction */}
          <section className="bg-gray-800/50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">1. Introduction</h2>
            <p className="text-lg mb-4">
              Welcome to TIRP (This Is a Rug Pull), the most transparent rug pull in crypto history. 
              We're not here to make promises we can't keep - we're here to make promises we won't keep.
            </p>
            <p className="text-lg">
              Unlike other projects that pretend to be legitimate, we're openly telling you: 
              this is probably going to zero. But hey, at least we're honest about it!
            </p>
          </section>

          {/* Tokenomics */}
          <section className="bg-gray-800/50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">2. Tokenomics</h2>
            <div className="space-y-4">
              <p className="text-lg">Total Supply: 1,000,000,000 TIRP</p>
              <p className="text-lg">Initial Price: Whatever you're willing to pay</p>
              <p className="text-lg">Final Price: Probably zero</p>
              <p className="text-lg">Transfer Fee: 0.5% (straight to our pockets)</p>
            </div>
          </section>

          {/* Anti-Whale */}
          <section className="bg-gray-800/50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">3. Anti-Whale Mechanism</h2>
            <p className="text-lg mb-4">
              We've implemented a maximum buy limit of $500 per wallet. This ensures that:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Only we can be the whales</li>
              <li>You can't dump faster than us</li>
              <li>We maintain control of the price (downward)</li>
            </ul>
          </section>

          {/* Roadmap */}
          <section className="bg-gray-800/50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">4. Roadmap</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🚀</span>
                <p className="text-lg">Phase 1: Launch (You buy)</p>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">📈</span>
                <p className="text-lg">Phase 2: Pump (Maybe)</p>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">📉</span>
                <p className="text-lg">Phase 3: Dump (Definitely)</p>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">💨</span>
                <p className="text-lg">Phase 4: Disappear (With your money)</p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="bg-gray-800/50 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">5. Team</h2>
            <p className="text-lg mb-4">
              Our team consists of anonymous developers who may or may not exist. 
              We're not doxxing ourselves because:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>We value our privacy (and freedom)</li>
              <li>We don't want to be found (after the rug pull)</li>
              <li>We're probably just one person with multiple wallets</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400">
          <p className="text-lg">Remember: Not financial advice. Actually, it's anti-financial advice.</p>
          <a href="/" className="text-yellow-400 hover:text-yellow-300 mt-4 inline-block">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
} 