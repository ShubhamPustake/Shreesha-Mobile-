"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "mr", name: "मराठी (Marathi)" },
]

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en")

  useEffect(() => {
    // Attempt to read the googtrans cookie to see what language is currently selected
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
      return null;
    }
    
    const googTrans = getCookie('googtrans');
    if (googTrans) {
      // googtrans looks like "/en/hi"
      const langCode = googTrans.split('/')[2];
      if (langCode) {
        setCurrentLang(langCode);
      }
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);

    // Google Translate injects an iframe. We manipulate the hidden select box
    const selectEl = document.querySelector("#google_translate_element select") as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
    } else {
      // Fallback: set cookie directly and reload
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
      window.location.reload();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full hover:bg-primary/10 hover:text-primary transition-colors" })}>
        <Globe className="h-5 w-5" />
        <span className="sr-only">Switch Language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer font-medium ${currentLang === lang.code ? 'text-primary bg-primary/10' : ''}`}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
