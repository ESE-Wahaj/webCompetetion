const Footer = () => {
  return (
    <footer className="bg-primary-800 text-whisper-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About ShoppingMart</h3>
            <p className="text-sm text-whisper-300">
              Your trusted online shopping destination with secure transactions
              and quality products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/products" className="text-whisper-300 hover:text-white transition">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="text-whisper-300 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-whisper-300 hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-whisper-300">
              <li>Email: support@shoppingmart.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Hours: Mon-Fri 9AM-6PM</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-700 mt-8 pt-6 text-center text-sm text-whisper-300">
          <p>&copy; {new Date().getFullYear()} ShoppingMart. All rights reserved.</p>
          <p className="mt-2">
            Built with security and quality in mind | DLL-Protected Admin Operations
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
