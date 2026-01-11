'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMessageSchema, type SendMessageFormData } from '@workspace/adapter-common/validators';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';

interface SendMessageFormProps {
    onSend: (content: string) => Promise<void>;
    isSending: boolean;
    placeholder?: string;
}

export function SendMessageForm({ onSend, isSending, placeholder = 'Écrivez votre message...' }: SendMessageFormProps) {
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

    const onSubmit = async (data: SendMessageFormData) => {
        await onSend(data.content);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
            <div className="flex-1">
                <Input
                    placeholder={placeholder}
                    {...register('content')}
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
