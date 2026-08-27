import React from 'react';

// Badges always pair color with a text label (status/priority name) so
// meaning never depends on color alone.
export const StatusBadge = ({ status }) => (
    <span
        className="px-2 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
        style={{ backgroundColor: status?.color || '#6B7280' }}
    >
        {status?.name || 'Unknown'}
    </span>
);

export const PriorityBadge = ({ priority }) => (
    <span
        className="px-2 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
        style={{ backgroundColor: priority?.color || '#6B7280' }}
    >
        {priority?.name || 'Unknown'}
    </span>
);
