import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle, Mail, Globe, MapPin } from "lucide-react";
import { Language } from "../types";

interface ContactProps {
  language: Language;
}

export default function Contact({ language }: ContactProps) {
  const isEn = language === "english";

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [industry, setIndustry] = useState("marketing");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setValidationError(
        isEn 
          ? "Please fill in all the required fields." 
          : "অনুগ্রহ করে সব প্রয়োজনীয় ক্ষেত্রগুলো পূরণ করুন।"
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError(
        isEn 
          ? "Please provide a valid email address." 
          : "দয়া করে একটি সঠিক ইমেইল আইডি দিন।"
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Clean up fields
      setName("");
      setEmail("");
      setMessage("");
      setIndustry("marketing");
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-[#090a0f] border-t border-gray-905 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
            {isEn ? "Enterprise Contact Node" : "এন্টারপ্রাইজ কন্টাক্ট নোড"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-4">
            {isEn ? "Connect with Our Growth Officers" : "আমাদের সাপোর্ট টিমের সাথে কথা বলুন"}
          </h2>
          <p className="text-gray-400">
            {isEn 
              ? "Have bulk generation requests or need dynamic custom API endpoints for your CRM? Reach out to us."
              : "আপনার কি বাল্ক জেনারেশন প্রয়োজন নাকি আমাদের এপিআই উইজেট ব্যবহার করতে চান? দ্রুত আমাদের এসএমএস করুন।"}
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          
          {/* LEFT: Brief Contact Info Details */}
          <div className="lg:col-span-5 space-y-8 bg-[#121420]/45 p-8 rounded-2xl border border-gray-800/80 shadow-inner">
            <h3 className="text-xl font-display font-bold text-white mb-6">
              {isEn ? "PCS Corporation" : "পিসিএস কর্পোরেশন তথ্য"}
            </h3>

            <div className="space-y-6 text-sm text-gray-400" id="contact-details-panel">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#090a0f] border border-gray-800 rounded-lg text-emerald-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {isEn ? "SaaS Support Email" : "সার্ভিস সাপোর্ট ইমেইল"}
                  </h4>
                  <p className="text-xs text-gray-400">pcschairman53@gmail.com</p>
                  <p className="text-[10px] text-gray-600 font-mono">Response within 12 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#090a0f] border border-gray-800 rounded-lg text-cyan-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {isEn ? "Production Locations" : "অফিস লোকেশন"}
                  </h4>
                  <p className="text-xs text-gray-400">Dhaka, Bangladesh // Cyber Operations Hub</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#090a0f] border border-gray-800 rounded-lg text-emerald-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {isEn ? "Development Network" : "ডেভেলপার নেটওয়ার্ক"}
                  </h4>
                  <p className="text-xs text-gray-400">Google Cloud Platform Platform Integration Hub</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800/80 pt-6">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase block mb-2">
                {isEn ? "Corporate SLA Standard" : "কর্পোরেট এসএলএ স্ট্যান্ডার্ড"}
              </span>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {isEn 
                  ? "All user data processed inside our nodes is kept in zero-leak container blocks. No data from generated responses is ever used for training outside LLMs."
                  : "আমাদের নোডে প্রক্রিয়া করা সমস্ত কন্টেন্ট ১০০% নিরাপদ সুরক্ষিত মেমোরিতে প্রসেস হয়ে থাকে এবং ব্রাউজার কি লিক ছাড়াই সম্পন্ন হয়।"}
              </p>
            </div>
          </div>

          {/* RIGHT: Contact/Message Input Form */}
          <div className="lg:col-span-7 bg-[#121420]/75 backdrop-blur-md rounded-2xl border border-gray-800/80 p-6 sm:p-8 shadow-2xl relative">
            
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4" id="contact-success-frame">
                <div className="inline-flex p-4.5 bg-emerald-400/10 border border-emerald-500/20 text-emerald-400 rounded-full mb-2 shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white">
                  {isEn ? "Message Routed Successfully" : "বার্তাটি সফলভাবে পাঠানো হয়েছে"}
                </h3>
                <p className="text-gray-400 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
                  {isEn 
                    ? "Thank you for reaching out. A growth officer has been assigned to your query and will reply to you within 12 hours."
                    : "আপনার বার্তাটি আমাদের এন্টারপ্রাইজ ইনবক্সে সফলভাবে রুট করা হয়েছে। একজন প্রবৃদ্ধি কর্মকর্তা দ্রুত আপনার মেইলে যোগাযোগ করবেন।"}
                </p>
                <div className="pt-6">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    id="btn-dismiss-contact"
                  >
                    {isEn ? "Send Another Message" : "আরেকটি মেসেজ পাঠান"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" id="contact-form-node">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-medium text-gray-400 tracking-wider uppercase mb-2">
                      {isEn ? "Your Full Name *" : "আপনার নাম *"}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isEn ? "e.g., Sadat Rahman" : "যেমন: সাদাত রহমান"}
                      className="w-full bg-[#090a0f] border border-gray-800 focus:border-cyan-400/50 rounded-lg p-3 text-xs sm:text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-300 shadow-inner"
                      id="contact-input-name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-gray-400 tracking-wider uppercase mb-2">
                      {isEn ? "Corporate Email Address *" : "কর্পোরেট ইমেইল আইডি *"}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sadat@company.com"
                      className="w-full bg-[#090a0f] border border-gray-800 focus:border-cyan-400/50 rounded-lg p-3 text-xs sm:text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-300 shadow-inner"
                      id="contact-input-email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-gray-400 tracking-wider uppercase mb-2">
                    {isEn ? "Select Industry/Niche" : "আপনার কাজের ক্ষেত্র"}
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-[#090a0f] border border-gray-800 focus:border-cyan-400/50 rounded-lg p-3 text-xs sm:text-sm text-gray-300 outline-none"
                    id="contact-input-industry"
                  >
                    <option value="marketing">{isEn ? "Digital Marketing Agency" : "ডিজিটাল মার্কেটিং এজেন্সি"}</option>
                    <option value="freelancing">{isEn ? "Freelance Content Creator" : "ফ্রিল্যান্স কনটেন্ট রাইটার"}</option>
                    <option value="e-commerce">{isEn ? "E-commerce & Local Brand" : "ই-কমার্স বা লোকাল বিজনেস"}</option>
                    <option value="software">{isEn ? "SaaS & AI Integrations Hub" : "স্যাস বা এআই ইন্টিগ্রেশন"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-gray-400 tracking-wider uppercase mb-2">
                    {isEn ? "How can we assist you? *" : "আপনার বার্তাটি লিখুন *"}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isEn 
                        ? "Briefly describe your bulk requirements, feedback, or custom pricing questions..." 
                        : "আপনার কাস্টম রিকোয়ারমেন্টস বা কন্টেন্ট জেনারেশন সংক্রান্ত প্রশ্নসমূহ এখানে লিখুন..."
                    }
                    className="w-full bg-[#090a0f] border border-gray-800 focus:border-cyan-400/50 rounded-lg p-3 text-xs sm:text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-300 shadow-inner"
                    id="contact-input-message"
                    required
                  />
                </div>

                {validationError && (
                  <p className="text-xs text-red-400" id="contact-err">
                    🚨 {validationError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isSubmitting 
                      ? "bg-slate-800 text-gray-500 cursor-not-allowed border-none" 
                      : "bg-[#090a0f] border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-black hover:bg-cyan-400 uppercase tracking-widest font-sans"
                  }`}
                  id="contact-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
                      <span>{isEn ? "Routing..." : "বার্তা পাঠানো হচ্ছে..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isEn ? "Send Secure Message" : "নিরাপদ বার্তা পাঠান"}</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
