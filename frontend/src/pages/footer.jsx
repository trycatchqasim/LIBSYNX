export function Footer() {
    const footerNavLinks = ["Home", "Features", "About"]
    const footerLegalLinks = ["Terms", "Privacy", "Contact"]
  
    return (
      <footer className="bg-[#5C4A3E] text-[#E1D7C7] py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-bold mb-1 text-[#F2E2AD]">LibSynx</h3>
              <p className="text-sm">Your modern library management solution</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h4 className="font-semibold mb-2 text-[#F2E2AD]">Links</h4>
                <ul className="flex flex-col gap-1 text-sm">
                  {footerNavLinks.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-[#F2E2AD]">Legal</h4>
                <ul className="flex flex-col gap-1 text-sm">
                  {footerLegalLinks.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E1D7C7]/20 mt-4 pt-4 text-center text-xs">
            <p>© LibSynx. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  