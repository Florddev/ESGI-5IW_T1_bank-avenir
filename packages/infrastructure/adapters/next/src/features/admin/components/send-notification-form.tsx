'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Textarea } from '@workspace/ui-react/components/textarea';
import { sendAdvisorNotificationSchema, type SendAdvisorNotificationFormData } from '@workspace/adapter-common/validators';
import { useTranslations } from '@workspace/ui-react/contexts';

interface SendNotificationFormProps {
    onSubmit: (data: SendAdvisorNotificationFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function SendNotificationForm({ onSubmit, onCancel, isLoading }: SendNotificationFormProps) {
    const t = useTranslations();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SendAdvisorNotificationFormData>({
        resolver: zodResolver(sendAdvisorNotificationSchema),
        defaultValues: {
            title: '',
            message: '',
        },
    });

    return (
        <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold mb-4">{t('features.advisor.messages.sendNotification')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('features.advisor.messages.sendNotificationDescription')}</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="title">{t('features.advisor.messages.notificationTitle')}</Label>
                    <Input
                        id="title"
                        {...register('title')}
                        placeholder={t('features.advisor.messages.notificationTitlePlaceholder')}
                        disabled={isLoading}
                    />
                    {errors.title && (
                        <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="message">{t('features.advisor.messages.notificationMessage')}</Label>
                    <Textarea
                        id="message"
                        {...register('message')}
                        placeholder={t('features.advisor.messages.notificationMessagePlaceholder')}
                        disabled={isLoading}
                        rows={4}
                    />
                    {errors.message && (
                        <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? t('features.advisor.messages.sending') : t('features.advisor.messages.send')}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        {t('features.advisor.messages.cancel')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
