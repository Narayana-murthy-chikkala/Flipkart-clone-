import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#172337] text-white pt-10 pb-6 font-sans mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-10">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-10 border-b border-gray-700">
          
          {/* Column 1: ABOUT */}
          <div className="lg:col-span-1">
            <h3 className="text-[#878787] text-[12px] font-medium mb-3 uppercase tracking-wider">ABOUT</h3>
            <ul className="flex flex-col gap-2">
              {['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press', 'Corporate Information'].map(item => (
                <li key={item}><a href="#" className="text-white text-[12px] hover:underline transition-all block">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 2: GROUP COMPANIES */}
          <div className="lg:col-span-1">
            <h3 className="text-[#878787] text-[12px] font-medium mb-3 uppercase tracking-wider">GROUP COMPANIES</h3>
            <ul className="flex flex-col gap-2">
              {['Myntra', 'Cleartrip', 'Shopsy'].map(item => (
                <li key={item}><a href="#" className="text-white text-[12px] hover:underline transition-all block">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 3: HELP */}
          <div className="lg:col-span-1">
            <h3 className="text-[#878787] text-[12px] font-medium mb-3 uppercase tracking-wider">HELP</h3>
            <ul className="flex flex-col gap-2">
              {['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ'].map(item => (
                <li key={item}><a href="#" className="text-white text-[12px] hover:underline transition-all block">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 4: CONSUMER POLICY */}
          <div className="lg:col-span-1">
            <h3 className="text-[#878787] text-[12px] font-medium mb-3 uppercase tracking-wider">CONSUMER POLICY</h3>
            <ul className="flex flex-col gap-2">
              {['Cancellation & Returns', 'Terms of Use', 'Security', 'Privacy', 'Sitemap', 'Grievance Redressal', 'EPR Compliance'].map(item => (
                <li key={item}><a href="#" className="text-white text-[12px] hover:underline transition-all block">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 5: Mail Us */}
          <div className="lg:col-span-1 border-l border-gray-700 pl-8 hidden lg:block">
            <h3 className="text-[#878787] text-[12px] font-medium mb-3 uppercase tracking-wider">Mail Us:</h3>
            <p className="text-white text-[12px] leading-relaxed font-normal">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India
            </p>
            <div className="mt-4">
               <h3 className="text-[#878787] text-[12px] font-medium mb-2 uppercase tracking-wider">Social:</h3>
               <div className="flex gap-4">
                  <FacebookIcon className="cursor-pointer hover:text-blue-400 transition-colors" />
                  <TwitterIcon className="cursor-pointer hover:text-blue-400 transition-colors" />
                  <YoutubeIcon className="cursor-pointer hover:text-red-500 transition-colors" />
               </div>
            </div>
          </div>

          {/* Column 6: Registered Office Address */}
          <div className="lg:col-span-1 pl-4 border-gray-700 hidden lg:block">
             <h3 className="text-[#878787] text-[12px] font-medium mb-3 uppercase tracking-wider">Registered Office Address:</h3>
             <p className="text-white text-[12px] leading-relaxed font-normal">
                Flipkart Internet Private Limited,<br />
                Buildings Alyssa, Begonia &<br />
                Clove Embassy Tech Village,<br />
                Outer Ring Road, Devarabeesanahalli Village,<br />
                Bengaluru, 560103,<br />
                Karnataka, India<br />
                CIN : U51109KA2012PTC066107<br />
                Telephone: <span className="text-[#2874f0]">044-45614700</span> / <span className="text-[#2874f0]">044-67415800</span>
             </p>
          </div>

        </div>

        {/* Bottom Bar: Services & Footer Links */}
        <div className="py-8 flex flex-wrap gap-y-6 justify-between items-center text-[12px] font-medium">
           
           <div className="flex items-center gap-2 cursor-pointer group">
              <span className="text-[#fb641b] group-hover:scale-110 transition-transform">🛒</span>
              <span className="group-hover:text-[#2874f0] transition-colors">Become a Seller</span>
           </div>

           <div className="flex items-center gap-2 cursor-pointer group">
              <span className="text-[#fb641b] group-hover:scale-110 transition-transform">⭐</span>
              <span className="group-hover:text-[#2874f0] transition-colors">Advertise</span>
           </div>

           <div className="flex items-center gap-2 cursor-pointer group">
              <span className="text-[#fb641b] group-hover:scale-110 transition-transform">🎁</span>
              <span className="group-hover:text-[#2874f0] transition-colors">Gift Cards</span>
           </div>

           <div className="flex items-center gap-2 cursor-pointer group">
              <span className="text-[#fb641b] group-hover:scale-110 transition-transform">❓</span>
              <span className="group-hover:text-[#2874f0] transition-colors">Help Center</span>
           </div>

           <div className="flex-1 lg:flex-none text-center lg:text-right">
              <span>© 2007-2026 Flipkart.com</span>
           </div>

           <div className="w-full lg:w-auto flex justify-center lg:justify-end">
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7bc.svg" alt="Payments" className="h-6 opacity-90" />
           </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
