"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

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
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [hasRequested, setHasRequested] = useState(false);
    const [editableText, setEditableText] = useState("");

    const isSummary = sectionType === "Profesyonel Özet" || sectionType === "summary";

    useEffect(() => {
        if (suggestions.length > 0 && isSummary) {
            setEditableText(suggestions[0]);
        }
    }, [suggestions, isSummary]);

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
                toast.error(data.error || "Öneriler alınamadı.");
                return;
            }

            setSuggestions(data.suggestions || []);
        } catch {
            toast.error("Bir ağ hatası oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = (text: string) => {
        onApply(text);
        onClose();
        // Reset state for next open
        setTimeout(() => {
            setSuggestions([]);
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
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                        <Sparkles className="h-5 w-5" />
                        AI ile Profesyonelleştir
                    </DialogTitle>
                    <DialogDescription>
                        Yazdığınız ham metni yapay zeka ile daha kurumsal ve dikkat çekici hale getirin.
                        {targetPosition && ` Hedef Pozisyon: "${targetPosition}"`}
                    </DialogDescription>
                </DialogHeader>

                {!hasRequested ? (
                    <div className="py-6 flex flex-col items-center justify-center space-y-4">
                        <div className="bg-muted p-4 rounded-lg w-full text-sm italic border text-muted-foreground whitespace-pre-wrap">
                            "{initialText || 'Metin girilmemiş.'}"
                        </div>
                        <Button
                            onClick={handleGenerate}
                            className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            İyileştirilmiş Versiyonlar Üret
                        </Button>
                    </div>
                ) : isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        <p className="text-sm text-muted-foreground">En iyi ifadeler aranıyor...</p>
                    </div>
                ) : isSummary ? (
                    <div className="py-4 space-y-4">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Önerilen Metin (Düzenleyebilirsiniz):
                        </label>
                        <Textarea
                            value={editableText}
                            onChange={(e) => setEditableText(e.target.value)}
                            rows={8}
                            className="resize-none w-full"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={() => handleApply(editableText)}
                            >
                                <Check className="mr-2 h-4 w-4" /> Seç ve Uygula
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="h-[400px] w-full rounded-md border p-4 mt-4 overflow-y-auto">
                        {suggestions.length === 0 && (
                            <p className="text-center text-muted-foreground pt-10">Sonuç bulunamadı.</p>
                        )}
                        <div className="space-y-4">
                            {suggestions.map((suggestion, idx) => (
                                <div key={idx} className="relative group p-4 border rounded-xl hover:border-purple-300 transition-colors bg-white dark:bg-zinc-900">
                                    <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap pr-24">
                                        {suggestion}
                                    </p>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                                            onClick={() => handleApply(suggestion)}
                                        >
                                            <Check className="mr-2 h-4 w-4" /> Seç
                                        </Button>
                                    </div>
                                    <div className="md:hidden absolute bottom-2 right-2 mt-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => handleApply(suggestion)}
                                        >
                                            Seç
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hasRequested && !isLoading && (
                    <DialogFooter>
                        <Button variant="outline" onClick={handleGenerate}>Yeniden Üret</Button>
                        <Button variant="ghost" onClick={onClose}>İptal</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
