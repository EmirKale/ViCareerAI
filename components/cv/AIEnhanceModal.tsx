"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

interface AIEnhanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialText: string;
    sectionType: string;
    targetPosition?: string;
    onApply: (text: string) => void;
}

export default function AIEnhanceModal({ isOpen, onClose, initialText, sectionType, targetPosition, onApply }: AIEnhanceModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<string>("");
    const [hasRequested, setHasRequested] = useState(false);
    const [editableText, setEditableText] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (suggestion) {
            setEditableText(suggestion);
        }
    }, [suggestion]);

    const handleGenerate = async () => {
        if (!initialText || initialText.trim().length < 5) {
            toast.error("Lütfen iyileştirmek için biraz daha uzun bir metin girin.");
            return;
        }

        setIsLoading(true);
        setHasRequested(true);
        try {
            const res = await fetch("/api/cv/ai-suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rawText: initialText,
                    sectionType,
                    targetPosition
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                if (data.error && data.error.includes("5 defa")) {
                    toast.warning(data.error, {
                        action: {
                            label: "Pro'ya Yükselt →",
                            onClick: () => router.push('/pricing')
                        }
                    });
                } else {
                    toast.error(data.error || "Öneriler alınamadı.");
                }
                return;
            }

            setSuggestion(data.suggestion || "");
        } catch {
            toast.error("Bir ağ hatası oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = (text: string) => {
        onApply(text);
        onClose();
        setTimeout(() => {
            setSuggestion("");
            setHasRequested(false);
            setEditableText("");
        }, 300);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-[600px] bg-[#FFFFFF] border-2 border-[#111111] rounded-none shadow-[6px_6px_0_#111111] p-6 text-[#111111]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#111111] font-['Archivo_Narrow'] text-xl font-bold tracking-tight">
                        <Sparkles className="h-5 w-5 text-[#1849A9]" />
                        Metni İyileştir
                    </DialogTitle>
                    <DialogDescription className="text-[#4A4742] text-sm">
                        Yazdığınız ham metni daha açık, net ve kurumsal bir dille revize edin.
                        {targetPosition && ` Hedef Pozisyon: "${targetPosition}"`}
                    </DialogDescription>
                </DialogHeader>

                {!hasRequested ? (
                    <div className="py-6 flex flex-col items-center justify-center space-y-4">
                        <div className="bg-[#FAF8F5] p-4 rounded-none w-full text-sm italic border border-[#D3CDC2] text-[#4A4742] whitespace-pre-wrap font-serif">
                            &quot;{initialText || 'Metin girilmemiş.'}&quot;
                        </div>
                        <Button
                            onClick={handleGenerate}
                            className="bg-[#1849A9] hover:bg-[#123782] text-white rounded-none w-full font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-wider h-11"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            İyileştirilmiş Versiyon Üret
                        </Button>
                    </div>
                ) : isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-[#1849A9]" />
                        <p className="text-sm font-['JetBrains_Mono'] text-[#757169]">İfadeler düzenleniyor...</p>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        <label className="text-xs font-['JetBrains_Mono'] uppercase tracking-wider font-semibold text-[#111111]">
                            Önerilen Metin:
                        </label>
                        <Textarea
                            value={editableText}
                            onChange={(e) => setEditableText(e.target.value)}
                            rows={8}
                            className="resize-none w-full bg-[#FFFFFF] border border-[#111111] text-[#111111] rounded-none focus-visible:ring-1 focus-visible:ring-[#1849A9] text-sm leading-relaxed"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                className="bg-[#1849A9] hover:bg-[#123782] text-white rounded-none font-['JetBrains_Mono'] text-xs uppercase tracking-wider"
                                onClick={() => handleApply(editableText)}
                            >
                                <Check className="mr-2 h-4 w-4" /> Seç ve Uygula
                            </Button>
                        </div>
                    </div>
                )}

                {hasRequested && !isLoading && (
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" className="border border-[#111111] rounded-none font-['JetBrains_Mono'] text-xs uppercase" onClick={handleGenerate}>Yeniden Üret</Button>
                        <Button variant="ghost" className="rounded-none font-['JetBrains_Mono'] text-xs uppercase" onClick={onClose}>İptal</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
