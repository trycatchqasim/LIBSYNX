function Footer() {
  const footerNavLinks = ["Home", "Features", "About"];
  const footerLegalLinks = ["Terms", "Privacy", "Contact"];

  return (
    <footer className="bg-[#5C4A3E] text-[#E1D7C7] py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 text-[#F2E2AD]">LibSynx</h3>
            <p>Your modern library management solution</p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="font-semibold mb-3 text-[#F2E2AD]">Links</h4>
              <ul className="flex flex-col gap-2">
                {footerNavLinks.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-[#F2E2AD]">Legal</h4>
              <ul className="flex flex-col gap-2">
                {footerLegalLinks.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E1D7C7]/20 mt-6 pt-6 text-center text-sm">
          <p>© LibSynx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
