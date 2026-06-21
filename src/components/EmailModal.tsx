import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { FiMail, FiCopy, FiCheck, FiX } from "react-icons/fi";
import "./styles/EmailModal.css";

const EmailModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleMailToClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const mailtoLink = target.closest("a");
      if (mailtoLink && mailtoLink.href) {
        // Handle both simple mailto: and absolute href check
        const href = mailtoLink.getAttribute("href") || "";
        if (href.startsWith("mailto:")) {
          e.preventDefault();
          const emailAddress = href.replace("mailto:", "");
          setEmail(emailAddress);
          setIsOpen(true);
        }
      }
    };

    document.addEventListener("click", handleMailToClick);
    return () => document.removeEventListener("click", handleMailToClick);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.killTweensOf([".email-modal-overlay", ".email-modal-container"]);
      gsap.fromTo(
        ".email-modal-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        ".email-modal-container",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
      );
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(".email-modal-container", {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(".email-modal-overlay", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setIsOpen(false);
        setCopied(false);
      },
    });
  };

  const handleGmail = () => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
    handleClose();
  };

  const handleOutlook = () => {
    window.open(`https://outlook.live.com/default.aspx?rru=compose&to=${email}`, "_blank");
    handleClose();
  };

  const handleDefault = () => {
    window.location.href = `mailto:${email}`;
    handleClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="email-modal-overlay" onClick={handleClose}>
      <div className="email-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="email-modal-close" onClick={handleClose} aria-label="Close modal">
          <FiX size={18} />
        </button>
        
        <div className="email-modal-header">
          <div className="email-modal-icon-wrap">
            <FiMail size={24} className="email-modal-icon" />
          </div>
          <h3>Send an Email</h3>
          <p className="email-address-text">{email}</p>
        </div>

        <div className="email-modal-options">
          <button className="email-option-btn gmail" onClick={handleGmail}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="option-icon">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2 14h-3V11l-3 3-3-3v7H6V6h2l4 4 4-4h2v12z"/>
            </svg>
            <div className="option-text-wrap">
              <span className="option-name">Gmail</span>
              <span className="option-desc">Open in Google Webmail</span>
            </div>
          </button>

          <button className="email-option-btn outlook" onClick={handleOutlook}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="option-icon">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H9v-2h3v2zm0-4H9v-2h3v2zm0-4H9V7h3v2zm6 8h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3V7h3v2z"/>
            </svg>
            <div className="option-text-wrap">
              <span className="option-name">Outlook</span>
              <span className="option-desc">Open in Outlook Webmail</span>
            </div>
          </button>

          <button className="email-option-btn default-app" onClick={handleDefault}>
            <FiMail size={20} className="option-icon" />
            <div className="option-text-wrap">
              <span className="option-name">Default Mail App</span>
              <span className="option-desc">Open local mail client</span>
            </div>
          </button>

          <button className="email-option-btn copy-btn" onClick={handleCopy}>
            {copied ? (
              <FiCheck size={20} className="option-icon text-green-500" />
            ) : (
              <FiCopy size={20} className="option-icon" />
            )}
            <div className="option-text-wrap">
              <span className="option-name">{copied ? "Copied!" : "Copy Address"}</span>
              <span className="option-desc">Save email to clipboard</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
