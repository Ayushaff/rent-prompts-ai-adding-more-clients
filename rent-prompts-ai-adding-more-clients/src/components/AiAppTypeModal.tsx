'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, Globe, X } from 'lucide-react'

interface AiAppTypeModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AiAppTypeModal({ isOpen, onClose }: AiAppTypeModalProps) {
    const appTypes = [
        { type: 'private', label: 'Private', href: '/dashboard/rapps/create/private', icon: Lock },
        { type: 'public', label: 'Public', href: '/dashboard/rapps/create/public', icon: Globe },
    ]
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={handleOverlayClick} // Close modal on outside click
                >
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6 pb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-indigo-700">Create AI App</h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <p className="text-indigo-500 mb-6">Choose the type of AI app you want to create.</p>
                            <div className="space-y-4">
                                {appTypes.map((app, index) => (
                                    <Link key={app.type} href={app.href} passHref>
                                        <button
                                            className={`w-full flex items-center justify-between px-4 py-2 border border-indigo-200 rounded-md hover:bg-indigo-50 hover:border-indigo-300 transition-colors ${index === 0 ? 'mb-4' : '' // Add margin-bottom to the first button
                                                }`}
                                            onClick={onClose} // Close the modal when a button is clicked
                                        >
                                            <span className="flex items-center text-indigo-700">
                                                <app.icon className="mr-2 h-4 w-4 text-indigo-500" />
                                                {app.label}
                                            </span>
                                            <span className="text-indigo-400">→</span>
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}