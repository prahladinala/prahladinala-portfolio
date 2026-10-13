"use client";
import { STORAGE_KEYS } from "@/config/constants";

import { useState, useEffect } from "react";
import { Download, Type, Volume2, VolumeX, Minus, Plus, Loader2, AlertCircle, Share2, Bookmark, CheckCircle, Eye, Play, Pause, Radio } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ReadingToolbarProps = {
  targetId: string;
  pdfTargetId?: string;
  title?: string;
};

export function ReadingToolbar({ targetId, pdfTargetId = targetId, title = "document" }: ReadingToolbarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [currentSentence, setCurrentSentence] = useState("");
  const [fullText, setFullText] = useState("");
  const [currentWordCharIndex, setCurrentWordCharIndex] = useState(0);

  const [fontSize, setFontSize] = useState(16); // Base 16px
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [generatedPdf, setGeneratedPdf] = useState<any>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadState = () => {
      try {
        const path = window.location.pathname;
        const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarkedNotes) || "[]");
        setIsBookmarked(bookmarks.includes(path));
        
        const completed = JSON.parse(localStorage.getItem(STORAGE_KEYS.completedNotes) || "[]");
        setIsCompleted(completed.includes(path));
      } catch (e) {
        console.error(e);
      }
    };

    loadState();
    window.addEventListener('prahlad-notes-updated', loadState);
    
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesisAvailable(true);
      const updateVoices = () => {
        const vList = window.speechSynthesis.getVoices();
        const enVoices = vList.filter((v) => v.lang.startsWith("en"));
        setVoices(enVoices.length > 0 ? enVoices : vList);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        window.speechSynthesis.cancel();
        window.removeEventListener('prahlad-notes-updated', loadState);
      };
    }
    
    return () => {
      window.removeEventListener('prahlad-notes-updated', loadState);
    };
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const toggleBookmark = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarkedNotes) || "[]");
      const path = window.location.pathname;
      if (isBookmarked) {
        const newBookmarks = bookmarks.filter((p: string) => p !== path);
        localStorage.setItem(STORAGE_KEYS.bookmarkedNotes, JSON.stringify(newBookmarks));
        setIsBookmarked(false);
      } else {
        bookmarks.push(path);
        localStorage.setItem(STORAGE_KEYS.bookmarkedNotes, JSON.stringify(bookmarks));
        setIsBookmarked(true);
      }
      window.dispatchEvent(new Event('prahlad-notes-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleComplete = () => {
    try {
      const completed = JSON.parse(localStorage.getItem(STORAGE_KEYS.completedNotes) || "[]");
      const path = window.location.pathname;
      if (isCompleted) {
        const newCompleted = completed.filter((p: string) => p !== path);
        localStorage.setItem(STORAGE_KEYS.completedNotes, JSON.stringify(newCompleted));
        setIsCompleted(false);
      } else {
        completed.push(path);
        localStorage.setItem(STORAGE_KEYS.completedNotes, JSON.stringify(completed));
        setIsCompleted(true);
      }
      window.dispatchEvent(new Event('prahlad-notes-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById(pdfTargetId);
    if (!element) return;

    try {
      setIsGeneratingPdf(true);
      
      const [htmlToImage, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf")
      ]);
      
      // Bulletproof theme detection
      const isDark = theme === 'dark' || resolvedTheme === 'dark' || document.documentElement.classList.contains('dark') || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const isFocus = theme === 'focus' || resolvedTheme === 'focus' || document.documentElement.classList.contains('focus');
      
      let pdfBgColor = '#ffffff'; // Default light
      if (isDark) pdfBgColor = '#0a0a0a'; // Dark mode background
      else if (isFocus) pdfBgColor = '#f3ead3'; // Focus mode parchment
      
      const dataUrl = await htmlToImage.toJpeg(element, { 
        quality: 0.98,
        backgroundColor: pdfBgColor,
        pixelRatio: 2
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const bottomMargin = 25; // Extra padding at the bottom for the footer
      
      const printWidth = pdfWidth - (margin * 2);
      const printHeight = (element.offsetHeight * printWidth) / element.offsetWidth;
      const pageImageCapacity = pageHeight - margin - bottomMargin;

      let heightLeft = printHeight;
      let position = margin;
      let totalPages = 1;

      // Helper to fill the entire PDF page with the theme's background color
      const fillPageBackground = () => {
        pdf.setFillColor(pdfBgColor);
        pdf.rect(0, 0, pdfWidth, pageHeight, 'F');
      };

      // Helper to mask top and bottom margins so the image doesn't bleed into them
      const maskMargins = () => {
        pdf.setFillColor(pdfBgColor);
        pdf.rect(0, 0, pdfWidth, margin, 'F'); // Mask top margin
        pdf.rect(0, pageHeight - bottomMargin, pdfWidth, bottomMargin, 'F'); // Mask bottom margin
      };

      fillPageBackground();
      pdf.addImage(dataUrl, 'JPEG', margin, position, printWidth, printHeight);
      maskMargins();
      heightLeft -= pageImageCapacity;

      while (heightLeft > 0) {
        // Shift image up by the exact capacity of one page to prevent skipping pixels
        position = position - pageImageCapacity; 
        pdf.addPage();
        totalPages++;
        fillPageBackground();
        pdf.addImage(dataUrl, 'JPEG', margin, position, printWidth, printHeight);
        maskMargins();
        heightLeft -= pageImageCapacity;
      }
      
      // Add Footer & Page Numbers to every page
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Set text color based on theme
        if (isDark) {
          pdf.setTextColor(150, 150, 150);
        } else if (isFocus) {
          pdf.setTextColor(150, 140, 130);
        } else {
          pdf.setTextColor(150, 150, 150);
        }
        
        pdf.setFontSize(9);
        
        // Center attribution slightly higher to respect bottom margin
        pdf.text("With love from prahladinala.in", pdfWidth / 2, pageHeight - 12, { align: "center" });
        
        // Right-aligned page numbers
        pdf.text(`Page ${i} of ${totalPages}`, pdfWidth - margin, pageHeight - 12, { align: "right" });
      }
      
      const dataUri = pdf.output("datauristring");
        setPdfPreviewUrl(dataUri);
        setGeneratedPdf(pdf);
        setPdfModalOpen(true);
      
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setErrorModalOpen(true);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleIncreaseFont = () => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  };

  const handleDecreaseFont = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize, targetId]);

  const speakText = (startIndex = 0, speed = playbackRate, voiceIdx = selectedVoiceIndex) => {
    if (!speechSynthesisAvailable) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    window.speechSynthesis.cancel();

    const text = target.innerText;
    setFullText(text);

    const textToSpeak = startIndex > 0 ? text.slice(startIndex) : text;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.rate = speed;
    if (voices[voiceIdx]) {
      utterance.voice = voices[voiceIdx];
    }

    utterance.onboundary = (e) => {
      const charIndex = startIndex + e.charIndex;
      setCurrentWordCharIndex(charIndex);

      const pre = text.slice(0, charIndex);
      const post = text.slice(charIndex);
      const startOfSentence = Math.max(pre.lastIndexOf("."), pre.lastIndexOf("!"), pre.lastIndexOf("?"), 0);
      const endOfSentenceRelative = post.search(/[.!?\n]/);
      const endOfSentence = endOfSentenceRelative === -1 ? text.length : charIndex + endOfSentenceRelative + 1;
      const sentence = text.slice(startOfSentence === 0 ? 0 : startOfSentence + 1, endOfSentence).trim();
      
      if (sentence && sentence.length > 3) {
        setCurrentSentence(sentence);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentence("");
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentence("");
    } else {
      speakText(0, playbackRate, selectedVoiceIndex);
    }
  };

  const handlePauseResume = () => {
    if (!isPlaying) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleSpeedChange = (newRate: number) => {
    setPlaybackRate(newRate);
    if (isPlaying) {
      speakText(currentWordCharIndex, newRate, selectedVoiceIndex);
    }
  };

  const handleVoiceChange = (newVoiceIdx: number) => {
    setSelectedVoiceIndex(newVoiceIdx);
    if (isPlaying) {
      speakText(currentWordCharIndex, playbackRate, newVoiceIdx);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5 mb-8 bg-muted/40 p-1.5 rounded-xl border border-border w-fit print:hidden shadow-sm backdrop-blur-sm">
        
        {/* Zen / Focus Mode */}
        {mounted && (
          <div className="flex items-center gap-1 border-r border-border pr-2 mr-1">
            <button
              onClick={() => {
                if (theme === "focus" || resolvedTheme === "focus") {
                  const prev = localStorage.getItem("prahlad-last-theme") || "system";
                  setTheme(prev === "focus" ? "system" : prev);
                } else {
                  localStorage.setItem("prahlad-last-theme", theme || "system");
                  setTheme("focus");
                }
              }}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                theme === "focus" || resolvedTheme === "focus"
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                  : "hover:bg-background hover:text-primary text-muted-foreground"
              }`}
              title="Toggle Zen / Focus Mode (Shortcut: Z)"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Zen (Z)</span>
            </button>
          </div>
        )}

        {/* Mark as Complete */}
        {mounted && (
          <div className="flex items-center gap-1 border-r border-border pr-2 mr-1">
            <button 
              onClick={toggleComplete} 
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${isCompleted ? 'bg-green-500/10 text-green-600 dark:text-green-500' : 'hover:bg-background hover:text-primary text-muted-foreground'}`}
              title="Mark as Complete"
            >
              <CheckCircle className={`w-4 h-4 ${isCompleted ? 'fill-green-500/20' : ''}`} />
              <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>
        )}

        {/* Font Controls */}
        <div className="flex items-center gap-1 border-r border-border pr-2 mr-1">
          <button 
            onClick={handleDecreaseFont} 
            className="p-2 rounded-lg hover:bg-background hover:text-primary transition-colors text-muted-foreground"
            title="Decrease Font Size"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center w-6 text-sm font-medium text-foreground">
            <Type className="w-4 h-4" />
          </div>
          <button 
            onClick={handleIncreaseFont} 
            className="p-2 rounded-lg hover:bg-background hover:text-primary transition-colors text-muted-foreground"
            title="Increase Font Size"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* Audio Control */}
        {speechSynthesisAvailable && (
          <button 
            onClick={toggleAudio} 
            className={`p-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${isPlaying ? 'bg-primary/10 text-primary' : 'hover:bg-background hover:text-primary text-muted-foreground'}`}
            title={isPlaying ? "Stop Audio" : "Play as Audio"}
          >
            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isPlaying && <span className="text-xs font-semibold pr-1">Stop</span>}
          </button>
        )}

        {/* Share & Bookmark Controls */}
        <div className="flex items-center gap-1 border-l border-border pl-2 ml-1">
          <button 
            onClick={toggleBookmark} 
            aria-label={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${isBookmarked ? 'bg-primary/10 text-primary' : 'hover:bg-background hover:text-primary text-muted-foreground'}`}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          
          <button 
            onClick={handleShare} 
            className="p-2 rounded-lg hover:bg-background hover:text-primary transition-colors text-muted-foreground flex items-center justify-center gap-2"
            title="Share Note"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button 
            onClick={handleDownloadPDF} 
            disabled={isGeneratingPdf}
            className="p-2 rounded-lg hover:bg-background hover:text-primary transition-colors text-muted-foreground flex items-center justify-center gap-2 disabled:opacity-50"
            title="Download File as PDF"
          >
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Download className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              PDF Generation Failed
            </DialogTitle>
            <DialogDescription className="pt-2">
              There was an unexpected error while generating the PDF document. This could be due to memory limits or formatting conflicts. Please try again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose render={<Button type="button" variant="secondary" />}>
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={pdfModalOpen} onOpenChange={setPdfModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-4 sm:p-6">
          <DialogHeader className="mb-2">
            <DialogTitle>PDF Preview</DialogTitle>
            <DialogDescription>
              Preview your document before downloading.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 w-full rounded-md border border-border overflow-hidden bg-muted/20 relative">
            {pdfPreviewUrl ? (
              <iframe 
                src={pdfPreviewUrl} 
                className="w-full h-full"
                title="PDF Preview"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setPdfModalOpen(false)}>Cancel</Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => {
                if (generatedPdf) {
                  generatedPdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
                  setPdfModalOpen(false);
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Smart TTS Player Bar */}
      {isPlaying && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] max-w-xl w-[92vw] sm:w-auto flex flex-col sm:flex-row items-center gap-3 p-3 px-4 bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 print:hidden">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
                Reading Aloud
              </p>
              <p className="text-xs font-semibold truncate max-w-[180px] sm:max-w-[240px] text-foreground">
                {currentSentence || title}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePauseResume}
                className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleAudio}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                title="Stop Audio"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border sm:pl-3">
            {/* Speed Toggles */}
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50">
              {[1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-1.5 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                    playbackRate === spd
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Voice Dropdown */}
            {voices.length > 1 && (
              <select
                value={selectedVoiceIndex}
                onChange={(e) => handleVoiceChange(Number(e.target.value))}
                className="text-xs bg-muted/60 border border-border/50 text-foreground rounded-lg px-2 py-1 max-w-[120px] truncate focus:outline-hidden"
                title="Select Voice"
              >
                {voices.slice(0, 8).map((v, idx) => (
                  <option key={idx} value={idx}>
                    {v.name.replace(/Microsoft|Google|Apple|English|Desktop/g, "").trim() || `Voice ${idx + 1}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </>
  );
}
