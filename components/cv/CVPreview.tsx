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
import { useState, useEffect, useMemo } from 'react';

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

    const TemplateComponent = useMemo(() => (
        template === 'modern' ? ModernTemplate :
            template === 'minimal' ? MinimalTemplate :
                template === 'executive' ? ExecutiveTemplate :
                    template === 'creative' ? CreativeTemplate :
                        template === 'professional' ? ProfessionalTemplate :
                            ClassicTemplate
    ), [template]);

    const [instance, updateInstance] = usePDF({ document: <TemplateComponent data={debouncedData} /> });

    useEffect(() => {
        updateInstance(<TemplateComponent data={debouncedData} />);
    }, [debouncedData, TemplateComponent, updateInstance]);

    if (!isClient) {
        return (
            <div className="flex h-[calc(100vh-150px)] items-center justify-center p-8 bg-[#F4F1EA] border border-[#111111]">
                <Loader2 className="h-6 w-6 text-[#1849A9] animate-spin" />
            </div>
        );
    }

    const HD_RATIO = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 4) : 4;

    return (
        <div className="w-full h-[calc(100vh-150px)] flex flex-col border border-[#111111] bg-[#EAE6DC] relative">
            {/* Show a subtle loading indicator when data is out of sync */}
            {data !== debouncedData && (
                <div className="absolute top-2 right-2 z-10 bg-[#FFFFFF] border border-[#111111] p-1.5 shadow-[2px_2px_0_#111111]">
                    <Loader2 className="h-4 w-4 text-[#1849A9] animate-spin" />
                </div>
            )}
            
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#FFFFFF] border-b border-[#111111] z-10">
                <span className="font-['JetBrains_Mono'] text-[11px] tracking-wider uppercase font-semibold text-[#111111]">Önizleme</span>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setScale(s => Math.max(0.1, +(s - 0.1).toFixed(1)))}
                        className="p-1 hover:bg-[#F4F1EA] border border-[#111111] transition-colors"
                        title="Küçült"
                    >
                        <ZoomOut className="w-3.5 h-3.5 text-[#111111]" />
                    </button>
                    <span className="text-xs font-['JetBrains_Mono'] text-[#111111] min-w-[40px] text-center font-bold">{Math.round(scale * 100)}%</span>
                    <button 
                        onClick={() => setScale(s => Math.min(2.0, +(s + 0.1).toFixed(1)))}
                        className="p-1 hover:bg-[#F4F1EA] border border-[#111111] transition-colors"
                        title="Büyüt"
                    >
                        <ZoomIn className="w-3.5 h-3.5 text-[#111111]" />
                    </button>
                </div>
            </div>

            {/* Document Viewer */}
            <div className="flex-1 overflow-auto w-full custom-scrollbar flex flex-col items-center bg-[#F4F1EA] py-8">
                {instance.loading && !instance.url ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-6 w-6 text-[#1849A9] animate-spin" />
                    </div>
                ) : instance.error ? (
                    <div className="flex h-full items-center justify-center text-[#A32020] text-sm font-['JetBrains_Mono']">
                        PDF oluşturulurken bir hata oluştu.
                    </div>
                ) : (
                    instance.url && (
                        <PdfDocument
                            file={instance.url}
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            loading={
                                <div className="flex items-center justify-center p-12">
                                    <Loader2 className="h-6 w-6 text-[#1849A9] animate-spin" />
                                </div>
                            }
                        >
                            {Array.from(new Array(numPages || 0), (el, index) => (
                                <div key={`page_${index + 1}`} className="mb-4 shadow-[4px_4px_0_#111111] border border-[#111111] bg-white">
                                    <PdfPage
                                        pageNumber={index + 1}
                                        scale={scale}
                                        devicePixelRatio={HD_RATIO}
                                        renderAnnotationLayer={false}
                                        renderTextLayer={false}
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
