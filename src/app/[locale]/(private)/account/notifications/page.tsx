'use client';

import { useTranslations } from 'next-intl';
import {
    useNotificationPreferences,
    useUpdateNotificationPreferences,
} from '@/lib/hooks/use-notifications';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { useEffect, useState } from 'react';

export default function NotificationPreferencesPage() {
    const t = useTranslations();
    const { data: preferences, isLoading } = useNotificationPreferences();
    const { mutate: updatePreferences, isPending } = useUpdateNotificationPreferences();

    const [localPreferences, setLocalPreferences] = useState({
        email: false,
        whatsapp: false,
        push: false,
        bookingReminders: false,
        promotions: false,
    });

    useEffect(() => {
        if (preferences) {
            setLocalPreferences({
                email: preferences.email,
                whatsapp: preferences.whatsapp,
                push: preferences.push,
                bookingReminders: preferences.bookingReminders,
                promotions: preferences.promotions,
            });
        }
    }, [preferences]);

    const handleToggle = (key: keyof typeof localPreferences) => {
        setLocalPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        updatePreferences({ preferences: localPreferences });
    };

    if (isLoading) {
        return (
            <div className="container max-w-2xl py-8 animate-pulse">
                <div className="h-8 w-64 bg-muted rounded mb-4" />
                <div className="h-4 w-96 bg-muted rounded mb-8" />
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-muted rounded" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{t('notification_preferences_title')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('notification_preferences_desc')}
                </p>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('notification_preferences_channels')}</CardTitle>
                        <CardDescription>
                            {t('notification_preferences_channels_desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email">{t('notification_email_label')}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_email_desc')}
                                </p>
                            </div>
                            <Switch
                                id="email"
                                checked={localPreferences.email}
                                onChange={() => handleToggle('email')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="whatsapp">{t('notification_whatsapp_label')}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_whatsapp_desc')}
                                </p>
                            </div>
                            <Switch
                                id="whatsapp"
                                checked={localPreferences.whatsapp}
                                onChange={() => handleToggle('whatsapp')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="push">{t('notification_push_label')}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_push_desc')}
                                </p>
                            </div>
                            <Switch
                                id="push"
                                checked={localPreferences.push}
                                onChange={() => handleToggle('push')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('notification_preferences_events')}</CardTitle>
                        <CardDescription>
                            {t('notification_preferences_events_desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="reminders">{t('notification_reminder_label')}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_reminder_desc')}
                                </p>
                            </div>
                            <Switch
                                id="reminders"
                                checked={localPreferences.bookingReminders}
                                onChange={() => handleToggle('bookingReminders')}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="promotions">{t('notification_promotions_label')}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_promotions_desc')}
                                </p>
                            </div>
                            <Switch
                                id="promotions"
                                checked={localPreferences.promotions}
                                onChange={() => handleToggle('promotions')}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 px-6 py-4">
                        <Button onClick={handleSave} disabled={isPending}>
                            {isPending ? t('saving') : t('notification_save_preferences')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
