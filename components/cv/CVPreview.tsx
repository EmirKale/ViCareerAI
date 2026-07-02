"use client";

import { usePDF } from '@react-pdf/renderer';
import { Document as PdfDocument, Page as PdfPage, pdfjs } from 'react-pdf';
import { ClassicTemplate, CVData } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useEffect } from 'react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CVPreviewProps {
    data: CVData;
    template?: 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'professional';
}

export default function CVPreview({ data, template = 'classic' }: CVPreviewProps) {
    const [isClient, setIsClient] = useState(false);
    const [debouncedData, setDebouncedData] = useState<CVData>(data);
    const [scale, setScale] = useState(1.0);
    const [numPages, setNumPages] = useState<number>();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedData(data);
        }, 300); // Wait 300ms after typing stops before generating PDF
        return () => clearTimeout(timer);
    }, [data]);

    const TemplateComponent =
        template === 'modern' ? ModernTemplate :
            template === 'minimal' ? MinimalTemplate :
                template === 'executive' ? ExecutiveTemplate :
                    template === 'creative' ? CreativeTemplate :
                        template === 'professional' ? ProfessionalTemplate :
                            ClassicTemplate;

    const [instance, updateInstance] = usePDF({ document: <TemplateComponent data={debouncedData} /> });

    useEffect(() => {
        updateInstance(<TemplateComponent data={debouncedData} />);
    }, [debouncedData, template, updateInstance]);

    if (!isClient) {
        return (
            <div className="flex h-[calc(100vh-150px)] items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/50 border rounded-lg">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
        );
    }

    // PDF Canvas çözünürlüğünü (HD) maksimum yapmak için devicePixelRatio'yu çok yüksek tutuyoruz
    const HD_RATIO = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 4) : 4;

    return (
        <div className="w-full h-[calc(100vh-150px)] flex flex-col rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-100 dark:bg-zinc-950 relative">
            {/* Show a subtle loading indicator when data is out of sync */}
            {data !== debouncedData && (
                <div className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-black/80 p-1.5 rounded-full shadow-sm backdrop-blur-sm">
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                </div>
            )}
            
            {/* Toolbar */}
            <div className="flex items-center justify-center gap-4 py-2 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-10">
                <button 
                    onClick={() => setScale(s => Math.max(0.1, +(s - 0.1).toFixed(1)))}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                >
                    <ZoomOut className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                </button>
                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{Math.round(scale * 100)}%</span>
                <button 
                    onClick={() => setScale(s => Math.min(2.0, +(s + 0.1).toFixed(1)))}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                >
                    <ZoomIn className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                </button>
            </div>

            {/* Document Viewer */}
            <div className="flex-1 overflow-auto w-full custom-scrollbar flex flex-col items-center bg-zinc-100/50 dark:bg-zinc-950/50 py-8">
                {instance.loading && !instance.url ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                    </div>
                ) : instance.error ? (
                    <div className="flex h-full items-center justify-center text-red-500 text-sm">
                        PDF oluşturulurken bir hata oluştu.
                    </div>
                ) : (
                    instance.url && (
                        <PdfDocument
                            file={instance.url}
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            loading={
                                <div className="flex items-center justify-center p-12">
                                    <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                                </div>
                            }
                        >
                            {Array.from(new Array(numPages || 0), (el, index) => (
                                <div key={`page_${index + 1}`} className="mb-4 shadow-md bg-white">
                                    <PdfPage
                                        pageNumber={index + 1}
                                        scale={scale}
                                        devicePixelRatio={HD_RATIO}
                                        renderAnnotationLayer={false}
                                        renderTextLayer={true} // Textleri vektörel olarak canvas'ın üzerine bindirir (En iyi kalite)
                                        className="max-w-full"
                                    />
                                </div>
                            ))}
                        </PdfDocument>
                    )
                )}
            </div>
        </div>
    );
}
