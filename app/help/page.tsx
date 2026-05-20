'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Minus, ChevronRight, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'delivery', name: 'Order Delivery and Shopping' },
  { id: 'account', name: 'My Account' },
  { id: 'payment', name: 'Payment' },
  { id: 'returns', name: 'Returns and Exchanges' },
  { id: 'international', name: 'International Shipping' },
];

const FAQ_DATA: Record<string, { question: string; answer: string | React.ReactNode }[]> = {
  delivery: [
    { 
      question: "How can i know the status of my order?", 
      answer: `All users have the option to track their orders by clicking on Track Order. The user has to enter the email address used while placing the order and the order number to track the order.

      Registered users can Signin and track their orders from order history section in the account page.` 
    },
    { 
      question: "What happens if my order is lost in transit?", 
      answer: "In the unlikely event that an order gets lost during transit, we wait for 15 days to track your lost order and if we are still unsuccessful, then we process your refund through the payment mode that you had opted for at the time of placing the order." 
    },
    { 
      question: "Where do you deliver within India?", 
      answer: "Currently we deliver to selected cities within India. Please check if we deliver to your pincode/city by entering your it in the product page/shopping/cartcheckout page. If there is no courier service available in your area/city, we apologize for the inconvenience caused." 
    },
    { 
      question: "I live outside india. can i order something to be delivered in india?", 
      answer: "Yes, you can order for something to be delivered in India as long as you provide a valid shipping address within India. Also, kindly note that we deliver only to selected cities within India. To check whether we deliver to your desired area/city kindly enter your pincode in the product page/shopping cart page/checkout page." 
    },
    { 
      question: "Do i need to pay shipping delivery charges?", 
      answer: "There are no shipping/ delivery charges within India. For information on shipping charges for international orders please see the Shipping and Handling Charges section under Shipping Policy section" 
    },
    { 
      question: "How soon will i receive my order?", 
      answer: `The time taken for delivery tends to vary according to the destination; however, we make our best efforts to ensure that the domestic order is delivered within 5-7 working days of you placing the order. For international orders please see the Time to Deliver section under Shipping Policy section.

      <div class="mt-4 space-y-2 text-sm">
        <p class="font-bold text-brand-text">Standard Delivery</p>
        <p>Our logistics team works closely with reliable delivery partners to ensure that your jewellery reaches you securely and promptly.</p>
        <p class="font-bold mt-2">Please note:</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>If your location is in a remote area or if there are any unforeseen delays due to weather, strikes, or other logistical constraints, the delivery timeline may be extended by an additional 1–2 days.</li>
          <li>Orders placed on Sundays or public holidays will be processed the next working day.</li>
          <li>For international orders, the delivery timeline follows a T+15 days schedule.</li>
          <li>Customers are encouraged to place orders early, especially during peak seasons or festivals, to ensure timely delivery.</li>
        </ul>
      </div>` 
    },
    { 
      question: "Do we need to show a id proof?", 
      answer: "Certain Logistic partners may request for an ID proof while delivering the shipment. When the original recipient is not available and the shipment value is high, the delivery agent may request for ID proof from whomever is collecting the shipment at the mentioned address on behalf of the customer. This is to ensure correct and safe delivery of the product." 
    },
    { 
      question: "Do we need a pan card?", 
      answer: `<div class="space-y-4">
        <p>For purchase above Rs. 2 lakhs, PAN card Number must be provided upon placing the order in the manner specified by Titan. Failure to provide the same shall result in cancellation of the order.</p>
        <p>For all domestic shipments, if the order value exceeds Rs 2 lakhs, the customer will need to enter the PAN card number and click on verify Pan card. Only upon PAN card verification the order will proceed ahead to the payment page. The billing name is supposed to be the same as the PAN card else the PAN card will not get verified and the customer will not be able to proceed ahead with the order.</p>
      </div>` 
    }
  ],
  account: [
    { question: "How do I create an account?", answer: "Click on the 'User' icon in the navbar and follow the sign-up process with your email and mobile number." }
  ],
  payment: [
    { 
      question: "What are the payment options available?", 
      answer: `<div class="space-y-6 text-sm leading-relaxed">
        <div>
          <h4 class="font-bold text-brand-text mb-2">Domestic Orders</h4>
          <p>Payments can be made through credit cards, debit cards, international cards, net banking or cash on delivery. Please note that payments will be accepted only in INR for domestic orders. In case of international credit cards, the transaction amount will be converted to INR before the payment is accepted. Currency conversion charges may apply based on your credit card policy.</p>
        </div>

        <div class="p-5 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
          <h4 class="font-bold text-[#8B1D2F] mb-2">International Orders</h4>
          <p>Payments are accepted through PayPal Payment gateway either by your PayPal account or by using International credit/debit cards only. For orders being shipped outside India, the payment will be accepted only in US Dollars. For international orders, currency conversion rates will apply according to the prevailing exchange rates on the day of placing the order.</p>
          <div class="mt-4 p-3 bg-white/50 rounded-xl text-[11px] border border-[#8B1D2F]/10 text-[#8B1D2F]">
            <strong>NOTE:</strong> Indian issued cards will not be accepted for international orders.
          </div>
        </div>

        <div>
          <h4 class="font-bold text-brand-text mb-2">ID Proof Requirements (International)</h4>
          <p>For International Orders you will be required to send us government-issued photo Identity proof preferably: <strong>Driving License</strong> or <strong>Passport</strong>.</p>
        </div>

        <div>
          <h4 class="font-bold text-brand-text mb-4 uppercase tracking-tighter">International Import Duties (Indicative)</h4>
          <div class="overflow-x-auto rounded-2xl border border-brand-text/5">
            <table class="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr class="bg-brand-bg border-b border-brand-text/10 text-brand-text font-bold">
                  <th class="py-3 px-3">S.No</th>
                  <th class="py-3 px-3">Country</th>
                  <th class="py-3 px-3">Duty (%)</th>
                  <th class="py-3 px-3">VAT/Tax (%)</th>
                </tr>
              </thead>
              <tbody class="text-brand-text/70">
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">1</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">The US</td>
                  <td class="py-2.5 px-3">5.8%</td>
                  <td class="py-2.5 px-3">11%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">2</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">The UK</td>
                  <td class="py-2.5 px-3">5%</td>
                  <td class="py-2.5 px-3">20%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">3</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Canada</td>
                  <td class="py-2.5 px-3">8.5%</td>
                  <td class="py-2.5 px-3">5%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">4</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">The UAE</td>
                  <td class="py-2.5 px-3">5%</td>
                  <td class="py-2.5 px-3">5%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">5</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Australia</td>
                  <td class="py-2.5 px-3">5%</td>
                  <td class="py-2.5 px-3">11%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">6</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Singapore</td>
                  <td class="py-2.5 px-3">0%</td>
                  <td class="py-2.5 px-3">7%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">7</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">New Zealand</td>
                  <td class="py-2.5 px-3">0.05%</td>
                  <td class="py-2.5 px-3">15%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">8</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">The Netherlands</td>
                  <td class="py-2.5 px-3">4%</td>
                  <td class="py-2.5 px-3">21%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">9</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Germany</td>
                  <td class="py-2.5 px-3">0%</td>
                  <td class="py-2.5 px-3">20%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">10</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Nepal</td>
                  <td class="py-2.5 px-3">9.5%</td>
                  <td class="py-2.5 px-3">0%</td>
                </tr>
                <tr class="hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">11</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Saudi Arabia</td>
                  <td class="py-2.5 px-3">5%</td>
                  <td class="py-2.5 px-3">0%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-[10px] italic text-brand-text/50">All rates are subject to change and borne by the customer at the time of delivery.</p>
        </div>
      </div>` 
    },
    { 
      question: "Which credit cards are accepted for domestic and international payments?", 
      answer: "We accept Visa | MasterCard | AMEX | Diners | JCB for domestic and international payments." 
    },
    { 
      question: "Which domestic debit cards are accepted?", 
      answer: `<div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div class="space-y-4">
          <h5 class="font-bold text-brand-text border-b border-brand-gold/20 pb-2">Visa Gateway</h5>
          <ul class="grid grid-cols-1 gap-1 text-[11px] text-brand-text/70">
            <li>Andhra Bank</li><li>Axis Bank Limited</li><li>Bank of Baroda</li><li>Barclays Bank Plc</li><li>Canara Bank</li>
            <li>City Union Bank Ltd</li><li>Corporation Bank</li><li>Dena Bank</li><li>Deutsche Bank AG</li><li>Federal Bank</li>
            <li>GE Money Financial Services</li><li>HDFC Bank Limited</li><li>ICICI Bank</li><li>IDBI Bank</li><li>Indian Overseas Bank</li>
            <li>IndusInd Bank</li><li>Kotak Bank (Virtual)</li><li>Karur Vyasa Bank</li><li>Laxmi Vilas Bank</li><li>Standard Chartered Bank</li>
            <li>State Bank Of India</li><li>Syndicate Bank</li><li>Union Bank of India</li>
          </ul>
        </div>
        <div class="space-y-4">
          <h5 class="font-bold text-brand-text border-b border-brand-gold/20 pb-2">Mastercard & Maestro</h5>
          <ul class="grid grid-cols-1 gap-1 text-[11px] text-brand-text/70">
            <li>Axis Bank</li><li>Bank Of India</li><li>Canara Bank</li><li>Central Bank of India</li><li>Citibank</li>
            <li>Corporation Bank</li><li>Federal Bank</li><li>HDFC Bank</li><li>ICICI Bank</li><li>IDBI Bank</li>
            <li>Indian Bank</li><li>Punjab National Bank</li><li>Standard Chartered Bank</li><li>State Bank Of India</li>
            <li>The Royal Bank of Scotland</li><li>Union Bank of India</li><li>YES Bank</li><li>Maestro Cards (Citibank, SBI)</li>
          </ul>
        </div>
      </div>` 
    },
    { 
      question: "Accepted domestic banks for payment through net banking?", 
      answer: `<div class="space-y-6 text-sm">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-[11px] text-brand-text/70">
          <div>Allahabad Bank</div><div>Andhra Bank</div><div>Axis Bank</div><div>Bank of Bahrain & Kuwait</div><div>Bank of Baroda</div>
          <div>Bank of India</div><div>Bank of Maharashtra</div><div>Canara Bank</div><div>Central Bank of India</div><div>City Union Bank</div>
          <div>Corporation Bank</div><div>Deutsche Bank</div><div>Development Credit Bank</div><div>Dhanlakshmi Bank</div><div>Federal Bank</div>
          <div>HDFC Bank</div><div>ICICI Bank</div><div>IDBI Bank</div><div>Indian Bank</div><div>Indian Overseas Bank</div>
          <div>IndusInd Bank</div><div>ING Vysya Bank</div><div>Jammu & Kashmir Bank</div><div>Karnataka Bank Ltd</div><div>Karur Vysya Bank</div>
          <div>Catholic Syrian Bank</div><div>Kotak Mahindra Bank</div><div>Yes Bank Ltd</div><div>Vijaya Bank</div><div>Laxmi Vilas Bank</div>
          <div>Oriental Bank of Commerce</div><div>Punjab & Sind Bank</div><div>Punjab National Bank</div><div>South Indian Bank</div>
          <div>State Bank of Bikaner & Jaipur</div><div>State Bank of Hyderabad</div><div>State Bank of Mysore</div><div>State Bank of Patiala</div>
          <div>State Bank of Travancore</div><div>Syndicate Bank</div><div>Tamilnad Mercantile Bank</div><div>UCO Bank</div><div>Union Bank of India</div>
          <div>United Bank of India</div>
        </div>
        <div class="pt-4 border-t border-brand-text/10">
          <p class="font-bold text-brand-text text-[12px] mb-2">Corporate Banking Support:</p>
          <div class="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-brand-text/60">
            <span>Karur Vysya</span><span>Lakshmi Vilas</span><span>PNB</span><span>Bank of Maharashtra</span><span>Bank of Baroda</span><span>Bank of India</span><span>SBI</span><span>Union Bank</span>
          </div>
        </div>
      </div>` 
    }
  ],
  returns: [
    { 
      question: "How can I cancel my order?", 
      answer: "Orders once placed can only be cancelled prior to shipment. Refer cancellation policy." 
    },
    { 
      question: "In case I change my mind about the size picked up, can I replace the order?", 
      answer: `Yes, it is possible to return the unused product and order for a replacement. Please refer to the Return Policy for details.

      Please note that returns/replacements are not applicable for International Orders. Although there are few exceptions. To know further about it kindly refer to the International Order section of Return Policy.` 
    },
    { 
      question: "What do I do if I receive the wrong product?", 
      answer: `You can call us on 1800-266-0123 and write to ecomsupport@titan.co.in to report the incident and cancel the order. If you want to return the product, please do not use it. We will arrange for the pick-up of the unused wrong item from the provided address through our logistic partner and arrange for the refund. For more details, refer to the Return Policy section.

      For international orders, please check the International Order section under Return Policy.` 
    },
    { 
      question: "The product that I received was damaged and I want to return it. what do I do?", 
      answer: `In the unlikely event that the product delivered is in damaged condition, you can return the product unused and in the same condition as you received it, in its original packaging, along with the invoice for a refund. We will arrange for the order to be collected from the provided address through our logistic partner and returned to us. Please refer to Return policy for details.

      Call us on 1800-266-0123 or write to ecomsupport@titan.co.in within 7 days of receipt for Tanishq product and 30 days of receipt for Mia product to report the incident.

      For international orders, please check the International Order section under Return Policy.` 
    },
    { 
      question: "What is the return policy?", 
      answer: `You can return the product unused and in the same condition as you received it, in its original packaging, along with the invoice for a refund. We will arrange for the order to be collected from the provided address through our logistic partner and returned to us. We shall process the refund only after the receipt of the product at our location in unused condition and in its original packaging along with its original tags and invoice, failing which refund may not be possible. Please refer to Return policy for details.

      For International Orders, please check the International Order section under Return policy.` 
    },
    { 
      question: "Do I need to pay for the return shipment if I return my order?", 
      answer: `We at Titan Company Limited will arrange for the return shipment to be collected and you do not need to make any payment for the courier.

      For International Orders, please check the International Order section under Return policy.` 
    },
    { 
      question: "Are the certain products which are not eligible for the return?", 
      answer: "We are committed for ensuring, full customer satisfaction, security and customer assistance with respect to the products available on our website. However, if you are not happy with the product, you can choose to return the product unused and in the same condition as you received it." 
    },
    { 
      question: "How do I return my order?", 
      answer: `<div class="space-y-4">
        <p>The order can be returned within 7 days for Tanishq product and 30 days for Mia product from the date you received the product. You need to call the customer care on 1800-266-0123 or email us at ecomsupport@titan.co.in stating that you want to return the product. The contact details of our logistic partner will be shared with you. You need to co-ordinate with them for return shipping. Take the following step:</p>
        
        <div class="bg-brand-gold/5 p-6 rounded-2xl border border-brand-gold/10 space-y-4 text-sm">
          <p><strong>a)</strong> Fill the ‘Return Form’ which you must have received with the product or download the Return Form from www.tanishq.co.in & fill the details in it.</p>
          <p><strong>b)</strong> Pack your order in original packaging and mention your name, order number and mobile number.</p>
          <p><strong>c)</strong> Enclose the original invoice, guaranty/warranty card & other tag, if any.</p>
          <p><strong>d)</strong> Our logistic partner will pick this package from you.</p>
          <p><strong>e)</strong> Post inspection, only after we get a go ahead from the QA (quality assurance) team the refund process will be initiated.</p>
        </div>

        <p class="text-[11px] italic text-[#8B1D2F]">For International Orders, please check the International Orders section under Return policy.</p>
      </div>` 
    }
  ],
  international: [
    { 
      question: "Which are the international shipping destinations covered?", 
      answer: "Australia | Bahrain | Canada | Germany | Italy | Kenya | Kuwait | Malaysia | Netherlands | New Zealand | Oman | Portugal | Qatar | Romania | Saudi Arabia | Singapore | South Africa | Spain | United Arab Emirates | United Kingdom | United States of America" 
    },
    { 
      question: "What is the minimum order value for an international order?", 
      answer: "For all international orders, your cart value should be minimum of $100 and maximum of $10000." 
    },
    { 
      question: "What products are excluded from international delivery?", 
      answer: "Gift Cards, Gold Coins, Silver Coins, Silver Jewellery and Loose Stones" 
    },
    { 
      question: "Which mode of payment options are available for international orders?", 
      answer: `Payments are accepted through PayPal Payment gateway either by your PayPal account or by using International credit/debit cards only. Payment will be received only in USD. Please note that cards (credit or debit) issued in India will not be accepted for any international orders.

      We would like to inform the following steps needs to be followed before reaching the payment gateway using your internationally issued credit card / debit card.

      <div class="my-4 p-4 bg-brand-gold/10 rounded-xl border border-brand-gold/20 font-bold text-center italic text-brand-text">
        "Select Payment Method ----> International Issued Cards -----> PAY FOR YOUR ORDER"
      </div>` 
    },
    { 
      question: "Who is the shipping partner?", 
      answer: "Our international shipping partner is UPS." 
    },
    { 
      question: "In how many days will i receive my international order?", 
      answer: "You will receive your order within 2-3 weeks after the confirmation of the order. An email confirmation will be sent to you, once your product is dispatched from our warehouse. Our logistic partner will get in touch with you once your product reaches the destination." 
    },
    { 
      question: "What are shipping charges?", 
      answer: `
        <div class="space-y-4">
          <p>The shipping and handling charges apply for international destinations. For Jewellery we charge $50 per order. All products/consignments are dispatched on “Delivery Duty Unpaid” (DDU) basis.</p>
          <p>Any other import duties or charges levied in the destination country of the shipment has to be borne by the customer as per actuals. These taxes and duties are subject to change.</p>
          
          <div class="overflow-x-auto mt-6 bg-white rounded-2xl border border-brand-text/5">
            <table class="w-full text-left text-[11px] sm:text-xs border-collapse">
              <thead>
                <tr class="border-b border-brand-text/10 text-brand-text font-bold bg-brand-gold/5 uppercase tracking-tighter">
                  <th class="py-3 px-3">S.No</th>
                  <th class="py-3 px-3">Country</th>
                  <th class="py-3 px-3">Duty (%)</th>
                  <th class="py-3 px-3">VAT/Tax (%)</th>
                </tr>
              </thead>
              <tbody class="text-brand-text/80">
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">1</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">The US</td>
                  <td class="py-2.5 px-3">5.8%</td>
                  <td class="py-2.5 px-3">11%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">2</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">The UK</td>
                  <td class="py-2.5 px-3">5%</td>
                  <td class="py-2.5 px-3">20%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">3</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Canada</td>
                  <td class="py-2.5 px-3">8.5%</td>
                  <td class="py-2.5 px-3">5%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">4</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">The UAE</td>
                  <td class="py-2.5 px-3">5%</td>
                  <td class="py-2.5 px-3">5%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">5</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Australia</td>
                  <td class="py-2.5 px-3">5%</td>
                  <td class="py-2.5 px-3">11%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">6</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Singapore</td>
                  <td class="py-2.5 px-3">0%</td>
                  <td class="py-2.5 px-3">7%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">7</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">New Zealand</td>
                  <td class="py-2.5 px-3">0.05%</td>
                  <td class="py-2.5 px-3">15%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">8</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">The Netherlands</td>
                  <td class="py-2.5 px-3">4%</td>
                  <td class="py-2.5 px-3">21%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">9</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Germany</td>
                  <td class="py-2.5 px-3">0%</td>
                  <td class="py-2.5 px-3">20%</td>
                </tr>
                <tr class="border-b border-brand-text/5 hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">10</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Nepal</td>
                  <td class="py-2.5 px-3">9.5%</td>
                  <td class="py-2.5 px-3">0%</td>
                </tr>
                <tr class="hover:bg-brand-gold/5 transition-colors">
                  <td class="py-2.5 px-3">11</td>
                  <td class="py-2.5 px-3 font-medium text-brand-text">Saudi Arabia</td>
                  <td class="py-2.5 px-3">5%</td>
                  <td class="py-2.5 px-3">0%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-[11px] font-medium text-[#8B1D2F] bg-[#8B1D2F]/5 p-4 rounded-xl border border-[#8B1D2F]/10 mt-4">
            In case the order is not accepted after it has reached the delivery country, a charge of import duty and freight charges would have to be borne by the customer and would be deducted from the refund.
          </p>
        </div>
      ` 
    },
    { 
      question: "Are returns or exchanges accepted?", 
      answer: "Currently, we do not accept any returns or exchanges of our products in case of international orders." 
    }
  ]
};

function HelpContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('delivery');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && FAQ_DATA[tab]) {
      setActiveTab(tab);
      setOpenIndex(0);
    }
  }, [searchParams]);

  const activeCategory = CATEGORIES.find(c => c.id === activeTab);
  const questions = FAQ_DATA[activeTab] || [];

  return (
    <div className="flex flex-col lg:flex-row gap-12 mt-12">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="sticky top-24 space-y-2">
          <h2 className="text-2xl font-serif text-brand-text mb-8 px-4">Help Categories</h2>
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  setOpenIndex(0);
                }}
                className={cn(
                  "w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 flex items-center justify-between group",
                  activeTab === cat.id
                    ? "bg-[#FDF9F6] text-[#8B1D2F] font-bold shadow-sm border border-[#8B1D2F]/10"
                    : "text-brand-text/60 hover:bg-brand-bg/50"
                )}
              >
                <span className="text-[13px] uppercase tracking-wider">{cat.name}</span>
                <ChevronRight size={16} className={cn("transition-transform duration-300", activeTab === cat.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100")} />
              </button>
            ))}
          </nav>

          {/* QUICK CONTACT BOX */}
          <div className="mt-12 p-8 bg-brand-text rounded-[32px] text-white space-y-6">
            <h3 className="font-serif text-xl">Need more help?</h3>
            <div className="space-y-4">
              <a href="tel:18002660123" className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone size={14} />
                </div>
                <span className="text-xs font-bold tracking-widest">1800-266-0123</span>
              </a>
              <div className="flex items-center space-x-3 text-white/80">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock size={14} />
                </div>
                <span className="text-xs tracking-wide">10 AM - 7 PM (Mon-Sat)</span>
              </div>
            </div>
            <Link href="/contact" className="block text-center w-full py-4 bg-brand-gold text-brand-text rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN FAQ AREA */}
      <main className="flex-1">
        <div className="mb-12">
          <div className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-4">
            <span>Zoniraz Help Center</span>
            <span className="w-8 h-[1px] bg-brand-gold/30"></span>
            <span>{activeCategory?.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-brand-text leading-tight">
            {activeCategory?.name}
          </h1>
        </div>

        <div className="space-y-4">
          {questions.map((faq, idx) => (
            <div
              key={idx}
              className={cn(
                "border rounded-[24px] transition-all duration-500 overflow-hidden",
                openIndex === idx ? "border-brand-gold/40 bg-[#FDF9F6]" : "border-brand-text/5 bg-white hover:border-brand-gold/20"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 sm:p-8 text-left group"
              >
                <span className={cn(
                  "text-base md:text-lg font-serif transition-colors duration-300",
                  openIndex === idx ? "text-[#8B1D2F]" : "text-brand-text group-hover:text-brand-gold"
                )}>
                  {faq.question}
                </span>
                <div className={cn(
                  "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                  openIndex === idx ? "bg-[#8B1D2F] text-white rotate-180" : "bg-brand-bg text-brand-text"
                )}>
                  {openIndex === idx ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div 
                      className="px-6 pb-8 sm:px-8 sm:pb-10 text-brand-text/70 leading-relaxed text-sm md:text-base border-t border-brand-gold/10 pt-6"
                      dangerouslySetInnerHTML={{ __html: String(faq.answer) }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* STILL HAVE QUESTIONS? */}
        <div className="mt-20 p-12 bg-brand-bg rounded-[40px] border border-brand-text/5 text-center relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl font-serif text-brand-text">Still have questions?</h3>
            <p className="text-brand-text/60 max-w-lg mx-auto">
              Our support team is available 24/7 to help you with your queries about our collections and services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-10 py-4 bg-brand-text text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">
                Contact Support
              </button>
              <button className="px-10 py-4 border border-brand-text/20 text-brand-text rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all">
                Visit Knowledge Base
              </button>
            </div>
          </div>
          {/* Decorative pattern */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
        </div>
      </main>
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-brand-bg pb-24 pt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Suspense fallback={<div>Loading Help Center...</div>}>
          <HelpContent />
        </Suspense>
      </div>
    </div>
  );
}
