import CowMascot from "./CowMascot";

export default function Footer() {
  return (
    <footer className="bg-grass-900 text-white py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CowMascot size="sm" />
              <div>
                <p className="text-lg font-bold">moovely</p>
                <p className="text-xs text-grass-200 tracking-widest uppercase">
                  the grass is greener
                </p>
              </div>
            </div>
            <p className="text-grass-200 text-sm leading-relaxed">
              Helping you understand what your money is really worth, wherever
              you live. Built with government data, not guesswork.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-grass-100">Data Sources</h3>
            <ul className="space-y-2 text-sm text-grass-200">
              <li>ONS Annual Survey of Hours &amp; Earnings</li>
              <li>ONS Private Rental Index</li>
              <li>UK House Price Index</li>
              <li>HMRC Tax &amp; NI Rates 2025/26</li>
              <li>Local Authority Council Tax Rates</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-grass-100">About</h3>
            <p className="text-sm text-grass-200 leading-relaxed mb-3">
              Moovely uses official UK government data to calculate real
              disposable income by area. We show you the number that actually
              matters - not just what things cost, but what you have left.
            </p>
            <p className="text-sm text-grass-200">
              Data updated quarterly. Last refresh: Q1 2026.
            </p>
          </div>
        </div>

        <div className="border-t border-grass-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-grass-300">
          <p>&copy; {new Date().getFullYear()} Moovely. All rights reserved.</p>
          <p>
            Made with honest data and a strong cup of tea. Moo.
          </p>
        </div>
      </div>
    </footer>
  );
}
