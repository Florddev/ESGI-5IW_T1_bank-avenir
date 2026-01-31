'use client';

import { useForm } from 'react-hook-form';
import { useRef, useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMessageSchema, type SendMessageFormData } from '@workspace/adapter-common/validators';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';

interface SendMessageFormProps {
    onSend: (content: string) => Promise<void>;
    isSending: boolean;
    placeholder?: string;
    onTypingChange?: (isTyping: boolean) => void;
}

export function SendMessageForm({ onSend, isSending, placeholder = 'Écrivez votre message...', onTypingChange }: SendMessageFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SendMessageFormData>({
        resolver: zodResolver(sendMessageSchema),
        defaultValues: {
            content: '',
        },
    });

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isTypingRef = useRef(false);

    const stopTyping = useCallback(() => {
        if (isTypingRef.current) {
            isTypingRef.current = false;
            onTypingChange?.(false);
        }
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
    }, [onTypingChange]);

    const handleInput = useCallback(() => {
        if (!onTypingChange) return;

        if (!isTypingRef.current) {
            isTypingRef.current = true;
            onTypingChange(true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(stopTyping, 2000);
    }, [onTypingChange, stopTyping]);

    useEffect(() => {
        return () => {
            stopTyping();
        };
    }, [stopTyping]);

    const onSubmit = async (data: SendMessageFormData) => {
        stopTyping();
        await onSend(data.content);
        reset();
    };

    const { onChange: registerOnChange, ...restRegister } = register('content');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
            <div className="flex-1">
                <Input
                    placeholder={placeholder}
                    onChange={(e) => {
                        registerOnChange(e);
                        handleInput();
                    }}
                    {...restRegister}
                    className="w-full"
                />
                {errors.content && (
                    <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
                )}
            </div>
            <Button type="submit" disabled={isSending} size="default">
                {isSending ? 'Envoi...' : 'Envoyer'}
            </Button>
        </form>
    );
}
