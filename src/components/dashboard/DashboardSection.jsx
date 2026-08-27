import React from 'react';

export const SkeletonRows = ({ rows = 3 }) => (
    <div className="space-y-3 animate-pulse" aria-hidden="true">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg" />
        ))}
    </div>
);

/**
 * Shared card wrapper for dashboard widgets. Renders its own loading
 * skeleton / error+retry / empty state so one section failing to load
 * never blanks the rest of the dashboard.
 */
const DashboardSection = ({
    title,
    action,
    loading,
    error,
    onRetry,
    empty,
    emptyMessage,
    children,
    className = '',
    skeletonRows = 3,
}) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold text-[#1E3A5F]">{title}</h2>
            {action}
        </div>
        {loading ? (
            <SkeletonRows rows={skeletonRows} />
        ) : error ? (
            <div className="text-center py-8">
                <p className="text-red-600 text-sm mb-2">{error}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="text-[#1E3A5F] text-sm font-medium hover:underline"
                    >
                        Try Again
                    </button>
                )}
            </div>
        ) : empty ? (
            <p className="text-gray-500 text-center py-8 text-sm">{emptyMessage}</p>
        ) : (
            children
        )}
    </div>
);

export default DashboardSection;
