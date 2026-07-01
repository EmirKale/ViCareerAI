"use client";

import { usePDF } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ClassicTemplate, CVData } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useEffect } from 'react';

// Set up worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CVPreviewProps {
    data: CVData;
    template?: 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'professional';
}

export default function CVPreview({ data, template = 'classic' }: CVPreviewProps) {
    const [isClient, setIsClient] = useState(false);
    const [debouncedData, setDebouncedData] = useState<CVData>(data);
    const [numPages, setNumPages] = useState<number>();
    const [scale, setScale] = useState(1.0);

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
            <div className="flex-1 overflow-auto w-full custom-scrollbar flex flex-col items-center p-4 gap-4 bg-zinc-100/50 dark:bg-zinc-950/50">
                {instance.loading && !instance.url ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                    </div>
                ) : instance.error ? (
                    <div className="flex h-full items-center justify-center text-red-500 text-sm">
                        PDF oluşturulurken bir hata oluştu.
                    </div>
                ) : (
                    <Document
                        file={instance.url}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={
                            <div className="flex items-center justify-center p-12">
                                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                            </div>
                        }
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <CVPage key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} />
                        ))}
                    </Document>
                )}
            </div>
        </div>
    );
}

function CVPage({ pageNumber, scale }: { pageNumber: number, scale: number }) {
    const HD_SCALE = 3;
    const [pageDim, setPageDim] = useState({ width: 595.28, height: 841.89 });
    
    return (
        <div 
            className="mb-4 shadow-md bg-white overflow-hidden relative"
            style={{
                width: pageDim.width * scale,
                height: pageDim.height * scale
            }}
        >
            <div style={{ transform: `scale(${1 / HD_SCALE})`, transformOrigin: 'top left', width: 'max-content' }}>
                <Page
                    pageNumber={pageNumber}
                    scale={scale * HD_SCALE}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    onLoadSuccess={(page) => {
                        if (page.originalWidth && page.originalHeight) {
                            setPageDim({ width: page.originalWidth, height: page.originalHeight });
                        }
                    }}
                />
            </div>
        </div>
    );
}
