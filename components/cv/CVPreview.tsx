"use client";

import { PDFViewer } from '@react-pdf/renderer';
import { ClassicTemplate, CVData } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CVPreviewProps {
    data: CVData;
    template?: 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' | 'professional';
}

export default function CVPreview({ data, template = 'classic' }: CVPreviewProps) {
    const [isClient, setIsClient] = useState(false);
    const [debouncedData, setDebouncedData] = useState<CVData>(data);
    const [pdfKey, setPdfKey] = useState(0);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setPdfKey(prev => prev + 1);
    }, [template]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedData(data);
        }, 1000); // Wait 1 second after typing stops before generating PDF
        return () => clearTimeout(timer);
    }, [data]);

    if (!isClient) {
        return (
            <div className="flex h-full items-center justify-center p-8 bg-zinc-50 border rounded-lg">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
        );
    }

    const TemplateComponent =
        template === 'modern' ? ModernTemplate :
            template === 'minimal' ? MinimalTemplate :
                template === 'executive' ? ExecutiveTemplate :
                    template === 'creative' ? CreativeTemplate :
                        template === 'professional' ? ProfessionalTemplate :
                            ClassicTemplate;

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border shadow-sm bg-zinc-50 relative">
            {/* Show a subtle loading indicator when data is out of sync */}
            {data !== debouncedData && (
                <div className="absolute top-2 right-2 z-10 bg-white/80 p-1.5 rounded-full shadow-sm">
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                </div>
            )}
            <PDFViewer key={pdfKey} style={{ width: '100%', height: '100%', border: 'none' }} showToolbar={false}>
                <TemplateComponent data={debouncedData} />
            </PDFViewer>
        </div>
    );
}
