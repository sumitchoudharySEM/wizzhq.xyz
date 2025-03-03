import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';

const PaymentModal = () => {
  const { bountie_id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [copiedSolana, setCopiedSolana] = useState(false);
  const [copiedEVM, setCopiedEVM] = useState(false);
  const [reward, setReward] = useState(0);
  const [token, setToken] = useState("");
  const pathname = usePathname();
 
  // Fetch listing data
  const fetchListings = async () => {
    setLoading(true); 
    try {
      const response = await fetch(`/api/bounty?slug=${bountie_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setListing(data.listing);

      // Calculate total amount & token
      if (data.listing) {
        const rewards = JSON.parse(data.listing.reward);
        const mainPrizes = rewards.prizes.reduce((sum, prize) => sum + prize, 0);
        const bonusTotal =
          rewards.bonusPrize && rewards.bonusPrize.amount && rewards.bonusPrize.number
            ? parseFloat(rewards.bonusPrize.amount) * parseFloat(rewards.bonusPrize.number)
            : 0;

        setReward(mainPrizes + bonusTotal);
        setToken(rewards.token);
      }
    } catch (error) {
      console.error("Error fetching listing data:", error);
    } finally {
      setLoading(false); 
    }
  };
  
  // Payment addresses
  const addresses = {
    solana: "3cSA1WwRsGDnKRWDJwhKxiDge64W3od68U7hiTyBhgun",
    evm: "0x31597742c1A6caE7e5A0d8Eb3cec269168DD6D9C"
  };
  
  // Copy address to clipboard
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'solana') {
        setCopiedSolana(true);
        setTimeout(() => setCopiedSolana(false), 2000);
      } else {
        setCopiedEVM(true);
        setTimeout(() => setCopiedEVM(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Fetch listing data on dashboard page
  useEffect(() => {
    if (pathname.includes('/dashboard')) {
        fetchListings();
    }
  }, [pathname]);
  
  //only show modal if listing is not verified
  useEffect(() => {
    if (listing && listing.verified === 0 && pathname.includes('/dashboard')) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [listing, pathname]);

  if (!isOpen || loading) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6 md:p-8"
          >
            <h2 className="text-lg md:text-2xl font-bold text-center text-gray-900">
              Finalize Your Payment to Go Live
            </h2>

            <div className="mt-3 md:mt-6 space-y-4 md:space-y-6">
              <p className="text-sm md:text-base text-gray-700">
                You have successfully created your bounty! Please make the payment of
                <span className="font-bold"> {reward + (reward >= 500 ? 50 + 0.1*reward : 0.2*reward)} {token} </span>
                <span className="font-light">({reward} {token} Prize Pool + {reward >= 500 ? 50 + 0.1*reward : 0.2*reward} {token} Platform Fees and Operational Cost) </span>
                to one of the following addresses.
              </p>

              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-gray-700">Polygon, Base, and other EVM chains:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={addresses.evm}
                    readOnly
                    className="flex-1 px-3 py-2 text-xs md:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(addresses.evm, 'evm')}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {copiedEVM ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardDocumentIcon className="w-5 h-5 text-gray-500" />}
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-gray-700">Solana:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={addresses.solana}
                    readOnly
                    className="flex-1 px-3 py-2 text-xs md:text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(addresses.solana, 'solana')}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {copiedSolana ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardDocumentIcon className="w-5 h-5 text-gray-500" />}
                  </motion.button>
                </div>
              </div>
              

              <p className="text-sm md:text-base text-gray-700">
                Your bounty will not be verified or made public until the full payment is received. For any assistance, feel free to contact our team.
              </p>

              <p className="text-xs md:text-sm text-gray-500 italic">Note: For payments on any other network, please contact us.</p>

              <div className="mt-6 md:mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 bg-green-500 text-white text-sm md:text-base rounded-lg hover:bg-green-600 font-medium transition-colors"
                >
                  I Understand
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;