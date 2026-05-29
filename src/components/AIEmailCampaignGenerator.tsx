import React, { useState, useEffect } from "react";
import { 
  Mail, FileText, Save, Copy, Trash2, Sparkles, Check, Globe, Languages, Download, Share2
} from "lucide-react";

interface SavedDraft {
  id: string;
  category: string;
  lang: string;
  subject: string;
  greeting: string;
  body: string;
  cta: string;
  signature: string;
  timestamp: string;
  businessName: string;
}

export default function AIEmailCampaignGenerator() {
  // State for the generator
  const [selectedCategory, setSelectedCategory] = useState<string>("promotion");
  const [selectedLang, setSelectedLang] = useState<"en" | "bn" | "hi">("en");
  const [businessName, setBusinessName] = useState<string>("");
  const [keyOffer, setKeyOffer] = useState<string>("");
  const [ctaText, setCtaText] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  
  // Generation output state
  const [generatedEmail, setGeneratedEmail] = useState<{
    subject: string;
    greeting: string;
    body: string;
    cta: string;
    signature: string;
  } | null>(null);

  // Drafts state
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [saveEffect, setSaveEffect] = useState<boolean>(false);
  
  // Custom toast notifications inside the module
  const [toastMessage, setToastMessage] = useState<string>("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Load drafts on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pcs_email_drafts");
      if (stored) {
        setSavedDrafts(JSON.parse(stored));
      }
      
      const lastEmail = localStorage.getItem("pcs_last_generated_email");
      if (lastEmail) {
        setGeneratedEmail(JSON.parse(lastEmail));
      }

      const lastCat = localStorage.getItem("pcs_last_email_cat");
      if (lastCat) setSelectedCategory(lastCat);

      const lastLangSetting = localStorage.getItem("pcs_last_email_lang");
      if (lastLangSetting && ["en", "bn", "hi"].includes(lastLangSetting)) {
        setSelectedLang(lastLangSetting as any);
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
  }, []);

  // Preset dictionary representing our high-fidelity translating email template matrix
  const executeEngine = () => {
    const bName = businessName.trim() || "[Business/Product]";
    const offer = keyOffer.trim();
    const cAction = ctaText.trim();
    const sender = senderName.trim() || "The PCS Team";

    let emailOutput = {
      subject: "",
      greeting: "",
      body: "",
      cta: "",
      signature: ""
    };

    if (selectedCategory === "promotion") {
      if (selectedLang === "en") {
        emailOutput = {
          subject: `Disrupt the Market with ${bName} - Exclusive Inside!`,
          greeting: `Dear Innovator,`,
          body: `We are thrilled to present ${bName}, meticulously crafted to streamline your workflow and drive unprecedented efficiency. With our solution, businesses have seen up to a 40% increase in productivity while reducing operational overhead.\n\nHere is what makes ${bName} a game-changer:\n• Advanced Multi-node Core Architecture\n• Automated Calibration & AI Optimization\n• Seamless Integration Labs\n\nTake advantage of our current campaign: ${offer || "Get started today with zero risk of upgrade fee!"}`,
          cta: `🚀 ${cAction || "Claim Your Priority Access Now"}`,
          signature: `Best regards,\n${sender}`
        };
      } else if (selectedLang === "bn") {
        emailOutput = {
          subject: `${bName} এর সাথে আপনার ব্যবসার ডিজিটাল রূপান্তর শুরু করুন!`,
          greeting: `প্রিয় উদ্যোক্তা ও ব্যবসার শুভানুধ্যায়ী,`,
          body: `আমরা অত্যন্ত আনন্দের সাথে পেশ করছি ${bName}, যা আপনার প্রাত্যহিক কাজকে আরও সহজ ও গতিময় করতে বিশেষভাবে ডিজাইন করা হয়েছে। আমাদের এই অত্যাধুনিক প্রযুক্তি ব্যবহারের মাধ্যমে গ্রাহকদের উৎপাদনশীলতা প্রায় ৪০% পর্যন্ত বৃদ্ধি পেয়েছে।\n\nমূল অফার বা বিশেষ সুবিধা সমূহ:\n• উচ্চ গতিসম্পন্ন মাল্টি-নোড আর্কিটেকচার\n• সময় ও কোটা সাশ্রয়ী অপটিমাইজেশন\n\nগ্রাহক লিমিটেড অফার: ${offer || "আজই শুরু করুন যেকোনো আর্থিক ঝুকি ছাড়াই!"}`,
          cta: `🚀 ${cAction || "তাৎক্ষণিক অ্যাক্সেস নিন ও শুরু করুন"}`,
          signature: `শুভেচ্ছান্তে,\n${sender}`
        };
      } else {
        emailOutput = {
          subject: `${bName} के साथ अपने व्यवसाय की कार्यक्षमता को नई ऊंचाइयों पर ले जाएं!`,
          greeting: `प्रिय व्यावसायिक भागीदार,`,
          body: `हमें आपके सामने ${bName} प्रस्तुत करते हुए अपार हर्ष हो रहा है, जिसे विशेष रूप से आपके काम को आसान और अत्यधिक उत्पादक बनाने के लिए विकसित किया गया है। इसके उपयोग से हमारे साझीदारों को कार्यकुशलता में अभूतपूर्व सुधार देखने को मिला है।\n\nमुख्य विशेषताएं:\n• सुरक्षित और विश्वसनीय मल्टी-नोड प्रोसेसर\n• सर्वोत्तम परिणाम और उत्कृष्ट प्रदर्शन\n\nसीमित समय का विशेष प्रस्ताव: ${offer || "बिना किसी अतिरिक्त जोखिम के आज ही शुरुआत करें!"}`,
          cta: `🚀 ${cAction || "अभी लाभ उठाएं और आगे बढ़ें"}`,
          signature: `सादर धन्यवाद,\n${sender}`
        };
      }
    } else if (selectedCategory === "sales") {
      if (selectedLang === "en") {
        emailOutput = {
          subject: `Hurry! Save big on ${bName} (Limited Time Offer)`,
          greeting: `Hello,`,
          body: `Are you looking to maximize your impact while cutting down on high monthly bills? Let ${bName} do the heavy lifting.\n\nFor a limited time, we are launching an exclusive opportunity for selected partners: ${offer || "Unprecedented savings on all enterprise plans and support sessions"}. Don't let your competitors get ahead.`,
          cta: `🎯 ${cAction || "Redeem Your Promo Code Now"}`,
          signature: `Talk soon,\n${sender}`
        };
      } else if (selectedLang === "bn") {
        emailOutput = {
          subject: `সীমিত সময়ের অফার! ${bName} এ আকর্ষণীয় ডিল খুঁজুন`,
          greeting: `প্রিয় গ্রাহক,`,
          body: `আপনার ব্যবসাকে পরবর্তী ধাপে নিয়ে যাওয়ার এখনই সময়। ${bName} এর সাথে আপনার দৈনন্দিন কার্যধারা অপ্টিমাইজ করুন এবং উপভোগ করুন বিষেশ অফার।\n\nলিমিটেড ডিল ডিটেইলস: ${offer || "প্রিমিয়াম মডিউলে আজীবন ১৫% ক্যাশব্যাক বিশাল ছাড়!"}। এখনই সময় প্রতিযোগিতায় এগিয়ে থাকার।`,
          cta: `🎯 ${cAction || "১৫% ডিসকাউন্ট কোড নিশ্চিত করুন"}`,
          signature: `ধন্যবাদান্তে,\n${sender}`
        };
      } else {
        emailOutput = {
          subject: `धमाका ऑफर! ${bName} पर सबसे बड़ी बचत का आनंद लें`,
          greeting: `नमस्ते,`,
          body: `क्या आप अपने मुनाफे को बढ़ाना चाहते हैं? ${bName} आपके लिए एकदम सही समाधान है। हमारी टीम आपके सभी कार्यों को एक ही स्थान पर प्रबंधित करती है।\n\nसीमित समय के लिए विशेष लाभ: ${offer || "सभी व्यावसायिक लायसेंस और टियर पर विशेष छूट!"}। अवसर जाने न दें।`,
          cta: `🎯 ${cAction || "स्पेशल कूपन कोड अनलॉक करें"}`,
          signature: `शुभकामनाएं,\n${sender}`
        };
      }
    } else if (selectedCategory === "festival") {
      if (selectedLang === "en") {
        emailOutput = {
          subject: `Celebrate the Season with ${bName} Festive Special 🎉`,
          greeting: `Dearest Friend,`,
          body: `May this festive season bring joy, warmth, and continuous growth to your venture. To double the celebration, we are offering an exclusive festive deal on ${bName}.\n\nFestive Package Details:\n• 24/7 Priority Node Access\n• Custom Campaign Blueprints Included\n• Special reward rate: ${offer || "Up to 30% discount automatically applied at checkout!"}`,
          cta: `🎁 ${cAction || "Get Your Holiday Pack Today"}`,
          signature: `Warmest wishes,\n${sender}`
        };
      } else if (selectedLang === "bn") {
        emailOutput = {
          subject: `উৎসবের খুশিতে ${bName} এর বিশেষ মেগা অফার! 🎉`,
          greeting: `প্রিয় শুভাকাঙ্ক্ষী,`,
          body: `এই বিশেষ উৎসবের মরসুমে আপনার মনে আসুক অনাবিল আনন্দ ও ব্যবসার সমৃদ্ধি। উৎসবের এই মহৎ আনন্দকে দ্বিগুণ করতে আমরা নিয়ে এসেছি ${bName}-এর বিশেষ উৎসবের ডিল।\n\nউৎসবের স্পেশাল অফার ট্যাগ: ${offer || "স্পেশাল প্যাকেজে বিশেষ ছাড় ও আকর্ষণীয় এআই বোনাস ক্রেডিট!"}`,
          cta: `🎁 ${cAction || "উৎসব গিফট হ্যাম্পার ক্লেইম করুন"}`,
          signature: `আন্তরিক শুভকামনায়,\n${sender}`
        };
      } else {
        emailOutput = {
          subject: `त्योहारों की मंगल कामनाएं और ${bName} पर विशेष उत्सव ऑफर! 🎉`,
          greeting: `प्रिय साथी,`,
          body: `त्योहार के इस पावन अवसर पर आपके और आपके पूरे परिवार की सुख-समृद्धि की कामना करते हैं। उत्सव की खुशियों को दोगुना करने के लिए हम ${bName} पर लाए हैं महा-बचत ऑफर।\n\nविशेष उत्सव भेंट: ${offer || "उत्सव पैक के साथ विशेष उपहार और २५% अतिरिक्त डिस्काउंट!"}`,
          cta: `🎁 ${cAction || "अपना उत्सव उत्सव पैक चुनें"}`,
          signature: `शुभकामनाओं के साथ,\n${sender}`
        };
      }
    } else if (selectedCategory === "followup") {
      if (selectedLang === "en") {
        emailOutput = {
          subject: `Checking in: Let's optimize your ${bName} experience`,
          greeting: `Hi there,`,
          body: `I wanted to personally check in and see how you are getting along. Since our last conversation, we've updated the core engine of ${bName} with highly optimized feature layers to support your workflow.\n\nOur latest platform update introduces: ${offer || "Increased computation response speed and secure sandbox servers"}.`,
          cta: `📅 ${cAction || "Book a Brief Sync Session"}`,
          signature: `Best regards,\n${sender}`
        };
      } else if (selectedLang === "bn") {
        emailOutput = {
          subject: `অনুসরণ বার্তা: ${bName} নিয়ে আপনার অভিজ্ঞতা কেমন?`,
          greeting: `আসসালামু আলাইকুম / নমস্কার,`,
          body: `আশা করি ভালো আছেন। আপনার সাথে পূর্বের আলোচনার প্রেক্ষিতে পুনরায় যোগাযোগ করছি। ${bName} সার্ভিসটিকে আপনার প্রয়োজন অনুযায়ী স্পেশাল কাস্টমাইজ করতে আমাদের টেকনিক্যাল টিম প্রস্তুত রয়েছে।\n\nনতুন ফিচার আপডেট: ${offer || "উচ্চ ক্ষমতা সম্পন্ন ডাটা ব্যাকআপ এবং ২৪/৭ অন-কল প্রিমিয়াম সাপোর্ট!"}`,
          cta: `📅 ${cAction || "ফ্রি কনসালটেশন শিডিউল করুন"}`,
          signature: `শুভেচ্ছান্তে,\n${sender}`
        };
      } else {
        emailOutput = {
          subject: `फॉलो-अप संपर्क: ${bName} के साथ आपका अनुभव कैसा रहा?`,
          greeting: `नमस्ते जी,`,
          body: `मैं व्यक्तिगत रूप से यह जानने के लिए लिख रहा हूँ कि ${bName} का उपयोग करने का आपका अनुभव कैसा है। हमारी तकनीकी टीम ने हाल ही में लोड क्षमता बढ़ाने के साथ-साथ विश्वसनीयता में सुधार करने के लिए नए अपग्रेड जारी किए हैं।\n\nविशेष सुधार: ${offer || "अतिरिक्त गति सीमा और सहज डैशबोर्ड नेविगेशन!"}`,
          cta: `📅 ${cAction || "एक संक्षिप्त बातचीत का समय शेड्यूल करें"}`,
          signature: `सादर,\n${sender}`
        };
      }
    } else if (selectedCategory === "realestate") {
      if (selectedLang === "en") {
        emailOutput = {
          subject: `Exclusive Property Listing powered by ${bName}`,
          greeting: `Dear Valued Investor,`,
          body: `Looking for your next high-value investment or dream residence? In coordination with ${bName}, we are excited to share a rare real estate opportunity. This stunning listing features state-of-the-art layout design, premium accessibility options, and top-tier projected appreciation.\n\nExclusive Offer details: ${offer || "Zero booking fees and special custom pricing schemas!"}`,
          cta: `🏡 ${cAction || "View Exclusive Virtual Tour & Map Portal"}`,
          signature: `Sincerely,\n${sender}`
        };
      } else if (selectedLang === "bn") {
        emailOutput = {
          subject: `অভিজাত প্রোপার্টি অফার: নতুন আবাসন সন্ধান করুন ${bName} এর সাথে`,
          greeting: `প্রিয় গ্রাহক,`,
          body: `আপনার চমৎকার আবাসন বা লাভজনক রিয়েল এস্টেট বিনিয়োগের সন্ধান শুরু হোক আমাদের সাথে। ${bName} প্ল্যাটফর্মের সৌজন্যে আমরা নিয়ে এসেছি এক অনন্য প্রজেক্ট, যা আধুনিক সুযোগ-সুবিধা এবং আকর্ষণীয় প্রাইম লোকেশনে অবস্থিত।\n\nলোকেশন সুবিধা ও কিস্তি সুযোগ: ${offer || "সহজ কিস্তি সুবিধা, রেজিস্ট্রেশন ফিতে বিশাল ছাড় এবং ফ্রি পার্কিং!"}`,
          cta: `🏡 ${cAction || "অনলাইন প্রোপার্টি ম্যাপ ও ব্রোশার ডাউনলোড করুন"}`,
          signature: `বিশ্বস্ততায়,\n${sender}`
        };
      } else {
        emailOutput = {
          subject: `विशेष प्रॉपर्टी डील्स: ${bName} के साथ पाएं अपने सपनों का ठिकाना`,
          greeting: `प्रिय निवेशक,`,
          body: `बधाई हो! रियल एस्टेट में सबसे प्रीमियम और उच्च निवेश योग्य प्रॉपर्टी डील अब आपके करीब है। ${bName} के विशेष सहयोग से हम आपके लिए लाए हैं बेहतरीन आवासीय और व्यावसायिक स्थान जो आधुनिक सुविधाओं से युक्त हैं।\n\nप्रॉपर्टी विशेषता एवं विशेष सौदा: ${offer || "आसान लोन विकल्प और विशेष बुकिंग डिस्काउंट!"}`,
          cta: `🏡 ${cAction || "विस्तृत नक्शा और ब्रोशर डाउनलोड करें"}`,
          signature: `शुभकामनाएं,\n${sender}`
        };
      }
    } else { // startup
      if (selectedLang === "en") {
        emailOutput = {
          subject: `Scale your venture further: Introducing ${bName} for Founders`,
          greeting: `Hey Founder,`,
          body: `We understand that building a venture is an incredibly thrilling yet intense journey. That is why we built ${bName} - to give startup builders a lightning-fast, highly optimized sandbox layer to automate and refine client conversion strategies.\n\nSpecial Early Access Package: ${offer || "Get 6 months free for teams raising pre-seed and seed rounds!"}`,
          cta: `🚀 ${cAction || "Apply For Startup Program"}`,
          signature: `Cheers,\n${sender}`
        };
      } else if (selectedLang === "bn") {
        emailOutput = {
          subject: `স্টার্টআপ প্রবৃদ্ধি বাড়ান: ফাউন্ডারদের জন্য নিয়ে এলাম ${bName}`,
          greeting: `প্রিয় ফাউন্ডার প্রতিষ্ঠাতা,`,
          body: `একটি স্টার্টআপ এগিয়ে নিয়ে যাওয়া সবসময়ই রোমাঞ্চকর ও চ্যালেঞ্জিং। আর সেজন্যই আমরা নিয়ে এসেছি ${bName}, যা নতুন উদ্যোক্তাদের কম খরচে ও দ্রুত গতিতে কাস্টমার কনভার্সন অপ্টিমাইজ করতে সরাসরি সাহায্য করবে।\n\nস্টার্টআপ অফার: ${offer || "নতুন স্টার্টআপ দলের জন্য বিনামূল্যে ৩ মাসের ফুল প্রিমিয়াম মডিউল অ্যাক্সেস!"}`,
          cta: `🚀 ${cAction || "আজই স্টার্টআপ প্রোগ্রামে আবেদন করুন"}`,
          signature: `ধন্যবাদসহ,\n${sender}`
        };
      } else {
        emailOutput = {
          subject: `स्टार्टअप ग्रोथ हैक: संस्थापकों के लिए लॉन्च हुआ ${bName}`,
          greeting: `प्रिय फाउंडर साथी,`,
          body: `हम जानते हैं कि एक नया उद्यम स्थापित करना कितनी मेहनत का काम है। इसीलिए हमने ${bName} को इस तरह तैयार किया है जो स्टार्टअप संस्थापकों को बिना अधिक लागत के बेहतरीन डिजिटल टूल्स का लाभ प्रदान कर सके और ग्राहक बढ़ाने में कारगर सिद्ध हो।\n\nस्टार्टअप विशेष लाभ: ${offer || "प्रारंभिक टीमों के लिए ६ महीने का पूर्ण प्रीमियम ट्रायल और कस्टमाइज़ेशन!"}`,
          cta: `🚀 ${cAction || "स्टार्टअप कार्यक्रम में शामिल हों"}`,
          signature: `सादर शुभकामनाएं,\n${sender}`
        };
      }
    }

    setGeneratedEmail(emailOutput);
    triggerToast(selectedLang === "bn" ? "অফলাইন এআই ইমেইল ক্যাম্পেইন জেনারেট করা হয়েছে!" : selectedLang === "hi" ? "स्थानीय ईमेल अभियान सफलतापूर्वक निर्मित!" : "Email marketing copy compiled successfully!");
    
    try {
      localStorage.setItem("pcs_last_generated_email", JSON.stringify(emailOutput));
      localStorage.setItem("pcs_last_email_cat", selectedCategory);
      localStorage.setItem("pcs_last_email_lang", selectedLang);
    } catch (e) {}
  };

  const handleCopyText = () => {
    if (!generatedEmail) return;
    const fullText = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.greeting}\n\n${generatedEmail.body}\n\n${generatedEmail.cta}\n\n${generatedEmail.signature}`;
    navigator.clipboard.writeText(fullText);
    setCopiedState(true);
    triggerToast("Copied to Clipboard!");
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleExportTxt = () => {
    if (!generatedEmail) return;
    const fullText = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.greeting}\n\n${generatedEmail.body}\n\n${generatedEmail.cta}\n\n${generatedEmail.signature}`;
    const element = document.createElement("a");
    const file = new Blob([fullText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Email_Campaign_${selectedCategory}_${selectedLang}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast("Downloaded as TXT draft!");
  };

  const saveToDrafts = () => {
    if (!generatedEmail) return;
    setSaveEffect(true);
    setTimeout(() => setSaveEffect(false), 400);

    const newDraft: SavedDraft = {
      id: Date.now().toString(),
      category: selectedCategory,
      lang: selectedLang,
      subject: generatedEmail.subject,
      greeting: generatedEmail.greeting,
      body: generatedEmail.body,
      cta: generatedEmail.cta,
      signature: generatedEmail.signature,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      businessName: businessName.trim() || "My Business"
    };

    const updated = [newDraft, ...savedDrafts];
    setSavedDrafts(updated);
    try {
      localStorage.setItem("pcs_email_drafts", JSON.stringify(updated));
    } catch(e) {}
    triggerToast("Campaign draft saved locally!");
  };

  const deleteDraft = (id: string) => {
    const updated = savedDrafts.filter(d => d.id !== id);
    setSavedDrafts(updated);
    try {
      localStorage.setItem("pcs_email_drafts", JSON.stringify(updated));
    } catch(e) {}
    triggerToast("Draft deleted.");
  };

  return (
    <div className="bg-[#121420]/85 backdrop-blur-md rounded-2xl border border-gray-800/80 p-5 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden text-left" id="email-campaign-generator-root">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Internal Custom Toast Notification overlay */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-[#090a10] border border-cyan-500/40 text-cyan-300 font-mono text-[10px] uppercase font-bold py-2 px-4.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-bounce">
          ✦ {toastMessage}
        </div>
      )}

      {/* Main Container Header with telemetry and badges */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-900 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/25 text-purple-400">
              <Mail className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-black text-purple-400 uppercase tracking-widest">
              AI Email Campaign Engine
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-1">
            Enterprise Email Blueprint Terminal
          </h3>
        </div>

        {/* Status badges required by rules */}
        <div className="flex flex-wrap gap-2 select-none">
          <span className="inline-flex items-center gap-1 text-[8.5px] font-mono font-bold text-cyan-400 bg-cyan-950/20 border border-cyan-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI Email Campaign Engine Active
          </span>
          <span className="inline-flex items-center gap-1 text-[8.5px] font-mono font-bold text-emerald-400 bg-emerald-950/10 border border-emerald-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Quota Safe Marketing Layer Enabled
          </span>
        </div>
      </div>

      {/* Inner split grid - controls on left, generated output preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Controls Builder */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Language Selector Node */}
          <div className="bg-[#090a0f]/50 p-3.5 rounded-xl border border-gray-900 space-y-2">
            <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">
              🌎 Translate Output Matrix:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setSelectedLang("en"); triggerToast("Translating to English Preset"); }}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  selectedLang === "en"
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                    : "bg-[#040508] border-gray-900 text-gray-500 hover:text-gray-300 hover:border-gray-800"
                }`}
              >
                🇺🇸 English
              </button>
              <button
                type="button"
                onClick={() => { setSelectedLang("bn"); triggerToast("বাংলা ফরম্যাট সক্রিয়!"); }}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  selectedLang === "bn"
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                    : "bg-[#040508] border-gray-900 text-gray-500 hover:text-gray-300 hover:border-gray-800"
                }`}
              >
                🇧🇩 বাংলা
              </button>
              <button
                type="button"
                onClick={() => { setSelectedLang("hi"); triggerToast("हिंदी फॉर्मेट सक्रिय!"); }}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  selectedLang === "hi"
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                    : "bg-[#040508] border-gray-900 text-gray-500 hover:text-gray-300 hover:border-gray-800"
                }`}
              >
                🇮🇳 हिन्दी
              </button>
            </div>
          </div>

          {/* Selector categories */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">
              📁 Choose Campaign Style Motif:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#080911]/90 border border-gray-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="promotion">💼 Business Promotion (কোম্পানি প্রচারণা)</option>
              <option value="sales">🎯 Urgent Sales Campaign (সীমিত সময়ের প্যাক)</option>
              <option value="festival">🎉 Holiday Festive Offer (উৎসব মেগা ছাড়)</option>
              <option value="followup">📅 Professional Follow-up (ক্লায়েন্ট অনুসরণ ও সিঙ্ক)</option>
              <option value="realestate">🏡 High-Value Real Estate Offer (প্রোপার্টি ইনভেস্টমেন্ট)</option>
              <option value="startup">🚀 Founder Startup Outreach (স্টার্টআপ আউটরিচ)</option>
            </select>
          </div>

          {/* Form parameters */}
          <div className="space-y-3.5 bg-black/20 p-4 rounded-xl border border-gray-900">
            
            <div className="space-y-1">
              <label className="block text-[9.5px] font-mono text-gray-500 uppercase tracking-wider">
                Product or Business Name:
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., GreenCraft Bamboo, SmartBottle Pro..."
                className="w-full bg-[#090a0f] border border-gray-850 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500/50 transition-all font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9.5px] font-mono text-gray-500 uppercase tracking-wider">
                Key Offer details / Discount Coupon:
              </label>
              <input
                type="text"
                value={keyOffer}
                onChange={(e) => setKeyOffer(e.target.value)}
                placeholder="e.g., Get up to 30% discount, Try free for 30 days..."
                className="w-full bg-[#090a0f] border border-gray-850 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500/50 transition-all font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9.5px] font-mono text-gray-500 uppercase tracking-wider">
                Call-to-Action Link Text:
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g., Claim Your Premium Seat Now..."
                className="w-full bg-[#090a0f] border border-gray-850 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500/50 transition-all font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9.5px] font-mono text-gray-500 uppercase tracking-wider">
                Sender Signature / Team Name:
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g., CEO Alex, Marketing Team Dhaka..."
                className="w-full bg-[#090a0f] border border-gray-850 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500/50 transition-all font-mono"
              />
            </div>

          </div>

          {/* Action Trigger button */}
          <button
            type="button"
            onClick={executeEngine}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-black font-mono font-bold text-xs uppercase rounded-xl transition-all tracking-wider shadow-[0_0_15px_rgba(147,51,234,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            id="btn-generate-email-blueprint"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-black" />
            <span>Generate Email Copies</span>
          </button>

        </div>

        {/* RIGHT COLUMN: Output display */}
        <div className="lg:col-span-7 space-y-4">
          
          {generatedEmail ? (
            <div className="space-y-3.5">
              
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-black/40 px-3 py-2 rounded-xl border border-gray-900">
                <span className="text-[9.5px] font-mono text-gray-500 tracking-wider">
                  ⚡ INSTANT OUTPUT COMPILED
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyText}
                    className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/25 text-cyan-400 rounded-lg text-xs flex items-center gap-1 transition-all"
                    title="Copy full campaign"
                    id="btn-copy-email-output"
                  >
                    {copiedState ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span className="text-[9.5px] font-mono">{copiedState ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={handleExportTxt}
                    className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-400 rounded-lg text-xs flex items-center gap-1 transition-all"
                    title="Download draft"
                    id="btn-export-email-output"
                  >
                    <Download className="w-3 h-3" />
                    <span className="text-[9.5px] font-mono">Export TXT</span>
                  </button>

                  <button
                    onClick={saveToDrafts}
                    className={`p-1.5 bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/25 text-purple-400 rounded-lg text-xs flex items-center gap-1 transition-all ${saveEffect ? "scale-90" : ""}`}
                    title="Save to temporary drafts list"
                    id="btn-save-email-output"
                  >
                    <Save className="w-3 h-3" />
                    <span className="text-[9.5px] font-mono">Save Draft</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Presentation Card simulating real email container (cyber style) */}
              <div className="bg-[#0b0c13] rounded-2xl border border-cyan-500/10 p-4.5 space-y-4 shadow-[inner_0_0_15px_rgba(6,182,212,0.03)] font-sans text-xs text-gray-300">
                
                {/* Meta simulation header */}
                <div className="space-y-1.5 border-b border-gray-900 pb-3 font-mono text-[10px] text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 self-start shrink-0">Subject:</span>
                    <span className="text-cyan-300 font-bold font-sans text-xs">{generatedEmail.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Route Network:</span>
                    <span className="text-gray-400 uppercase">LOCAL-LAYER // QUOTA-PROTECTED // NON-API</span>
                  </div>
                </div>

                {/* Body Content segments */}
                <div className="space-y-3 font-sans leading-relaxed">
                  <p className="font-bold text-gray-100">{generatedEmail.greeting}</p>
                  <p className="whitespace-pre-wrap text-gray-300">{generatedEmail.body}</p>
                </div>

                {/* Digital Call To Action simulated block */}
                <div className="py-2 flex justify-start">
                  <span className="inline-block bg-gradient-to-r from-cyan-600/35 to-purple-600/35 border border-cyan-500/60 text-white rounded-xl px-4.5 py-2 font-bold font-mono tracking-wide text-xs shadow-[0_0_10px_rgba(6,182,212,0.1)] select-none">
                    {generatedEmail.cta}
                  </span>
                </div>

                {/* Signature bottom of mail */}
                <div className="border-t border-gray-950 pt-3.5 mt-3.5 text-gray-400 font-bold whitespace-pre-wrap font-sans">
                  {generatedEmail.signature}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-[#0d0f1a]/30">
              <div className="w-11 h-11 rounded-xl bg-purple-950/40 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-3 shadow-[0_0_15px_rgba(147,51,234,0.15)] animate-pulse">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                No Blueprint Generated Yet
              </h4>
              <p className="text-xs text-gray-400 max-w-[280px] mt-1 pr-1 font-sans leading-relaxed">
                Provide product specifications on the left, choose your target language format, and click Compile.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* FOOTER-SECTION inside card: SAVED DRAFTS DIRECTORY list */}
      {savedDrafts.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-900" id="saved-drafts-directory">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#10b981]">
              <FileText className="w-3.5 h-3.5" />
              <span>Saved Blueprints Directory ({savedDrafts.length})</span>
            </div>
            <button
              onClick={() => {
                if(confirm("Confirm clearing all email drafts?")) {
                  setSavedDrafts([]);
                  try { localStorage.removeItem("pcs_email_drafts"); } catch(e) {}
                  triggerToast("Drafts list cleared.");
                }
              }}
              className="text-[9px] font-mono text-red-400 hover:text-red-300 transition-all uppercase underline cursor-pointer"
            >
              Clear Directory
            </button>
          </div>

          {/* Grid list of local saved drafts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {savedDrafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-black/45 border border-gray-950 hover:border-cyan-500/20 rounded-xl p-3.5 transition-all relative flex flex-col justify-between group text-[11px]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5 mb-1.5">
                    <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/20 px-1.5 py-0.5 rounded border border-cyan-900">
                      {draft.category} • {draft.lang.toUpperCase()}
                    </span>
                    <button
                      onClick={() => deleteDraft(draft.id)}
                      className="p-1 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded transition-all cursor-pointer"
                      title="Delete draft"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <h5 className="font-bold text-gray-200 line-clamp-1 font-sans">{draft.subject}</h5>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5 mb-2">Business: {draft.businessName}</p>
                  <p className="text-gray-400 line-clamp-2 leading-relaxed text-[10.5px]">
                    {draft.greeting} {draft.body}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-900 flex items-center justify-between text-[9px] font-mono text-gray-500">
                  <span>Saved at {draft.timestamp}</span>
                  <button
                    onClick={() => {
                      setGeneratedEmail({
                        subject: draft.subject,
                        greeting: draft.greeting,
                        body: draft.body,
                        cta: draft.cta,
                        signature: draft.signature
                      });
                      setBusinessName(draft.businessName);
                      setSelectedCategory(draft.category);
                      setSelectedLang(draft.lang as any);
                      triggerToast("Draft loaded into preview panel!");
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-bold uppercase cursor-pointer"
                  >
                    Load Preview ↗
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
