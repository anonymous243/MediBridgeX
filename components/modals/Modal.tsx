'use client';

import * as Dialog from '@radix-ui/react-dialog';

import {
    X,
} from 'lucide-react';

interface ModalProps {
    open: boolean;
    onOpenChange: (
        open: boolean
    ) => void;

    title: string;
    description?: string;

    children: React.ReactNode;
}

export function Modal({
    open,
    onOpenChange,
    title,
    description,
    children,
}: ModalProps) {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={onOpenChange}
        >
            <Dialog.Portal>
                {/* OVERLAY */}
                <Dialog.Overlay
                    className="
            fixed inset-0 z-[100]
            bg-slate-950/50
            backdrop-blur-sm
            animate-in fade-in
          "
                />

                {/* CONTENT */}
                <Dialog.Content
                    className="
            fixed left-1/2 top-1/2 z-[101]
            w-[95vw] max-w-2xl
            -translate-x-1/2 -translate-y-1/2
            rounded-[36px]
            border border-slate-200/80
            bg-white/95
            p-8
            shadow-[0_30px_120px_rgba(15,23,42,0.18)]
            backdrop-blur-2xl
            outline-none
          "
                >
                    {/* HEADER */}
                    <div className="flex items-start justify-between">
                        <div>
                            <Dialog.Title
                                className="
                  text-3xl font-black
                  tracking-[-0.05em]
                  text-slate-950
                "
                            >
                                {title}
                            </Dialog.Title>

                            {description && (
                                <Dialog.Description
                                    className="
                    mt-3 text-sm leading-7
                    text-slate-500
                  "
                                >
                                    {description}
                                </Dialog.Description>
                            )}
                        </div>

                        {/* CLOSE */}
                        <Dialog.Close
                            className="
                flex h-12 w-12 items-center
                justify-center rounded-2xl
                border border-slate-200
                bg-white transition
                hover:bg-slate-50
              "
                        >
                            <X className="h-5 w-5 text-slate-500" />
                        </Dialog.Close>
                    </div>

                    {/* BODY */}
                    <div className="mt-8">
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}