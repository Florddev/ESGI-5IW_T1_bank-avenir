/**
 * Exemple d'intégration du système de notifications en temps réel
 * dans le header du dashboard
 * 
 * Ce fichier montre comment utiliser le NotificationCenter avec
 * toutes les fonctionnalités temps réel
 */

'use client';

import { useState } from 'react';
import { NotificationCenter, NotificationList } from '@workspace/adapter-next/features/notifications';
import { useRealtimeNotifications } from '@workspace/adapter-next/features/notifications';
import type { RealtimeNotificationDto } from '@workspace/application/dtos';
import { Bell } from 'lucide-react';

interface DashboardHeaderWithNotificationsProps {
    userId: string;
    userName: string;
}

/**
 * Header de dashboard avec notifications temps réel
 * Exemple complet d'utilisation
 */
export function DashboardHeaderWithNotifications({
    userId,
    userName,
}: DashboardHeaderWithNotificationsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [lastNotification, setLastNotification] = useState<RealtimeNotificationDto | null>(null);

    // Hook temps réel avec callbacks
    const { notifications, isConnected, connectionError, reconnect } = useRealtimeNotifications({
        userId,
        onNotification: (notification) => {
            // Afficher un toast
            setLastNotification(notification);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);

            // Notification navigateur
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: '/icon-notification.png',
                    tag: notification.id,
                });
            }

            // Son de notification (optionnel)
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(() => {
                // Ignore si autoplay bloqué
            });
        },
        onNotificationRead: (notificationId) => {
            console.log('Notification marquée lue:', notificationId);
        },
        onError: (error) => {
            console.error('Erreur connexion temps réel:', error);
        },
        autoReconnect: true,
        reconnectInterval: 5000,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Avenir Bank
                        </h1>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Statut connexion temps réel */}
                        <div className="flex items-center gap-2 text-sm">
                            {isConnected ? (
                                <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-green-600 dark:text-green-400">
                                        Temps réel actif
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                    <span className="text-red-600 dark:text-red-400">
                                        Déconnecté
                                    </span>
                                    <button
                                        onClick={reconnect}
                                        className="text-xs underline hover:no-underline"
                                    >
                                        Reconnecter
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Notification Center */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label="Notifications"
                            >
                                <Bell className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown notifications */}
                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Notifications
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        <NotificationList
                                            userId={userId}
                                            maxHeight="384px"
                                            onNotificationClick={(notif) => {
                                                console.log('Notification cliquée:', notif);
                                                setIsOpen(false);
                                                // Navigation si nécessaire
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {userName}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast notification en temps réel */}
            {showToast && lastNotification && (
                <div className="fixed bottom-4 right-4 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-in slide-in-from-right">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <Bell className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {lastNotification.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {lastNotification.message}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowToast(false)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Overlay pour fermer le dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </header>
    );
}

/**
 * Exemple d'utilisation dans une page
 */
export function DashboardPageExample() {
    // Récupérer l'utilisateur depuis le contexte/session
    const currentUser = {
        id: 'user-123',
        name: 'Jean Dupont',
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeaderWithNotifications
                userId={currentUser.id}
                userName={currentUser.name}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Dashboard
                </h1>

                {/* Contenu du dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cards, widgets, etc. */}
                </div>
            </main>
        </div>
    );
}
