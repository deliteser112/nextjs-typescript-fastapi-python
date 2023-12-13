import React from 'react';
import moment from 'moment';

const ReportCard = ({ incidentId, dateTime, description, reporter, severity, onDeleteItem }) => {
    // Define styles for severity tags
    const getSeverityStyles = (severity) => {
        switch (severity.toLowerCase()) {
            case 'minimal':
                return 'bg-green-500 text-white';
            case 'moderate':
                return 'bg-yellow-500 text-black';
            case 'high':
                return 'bg-red-500 text-white';
            case 'severe':
                return 'bg-blue-500 text-white';
            case 'catastrophic':
                return 'bg-orange-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };
    return (
        <div
            className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        >
            <div className="flex justify-end">
                <button
                    onClick={() => onDeleteItem(incidentId)}
                    className="text-red-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M14 11v6m-4-6v6M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M4 7h16M7 7l2-4h6l2 4" /></svg>
                </button>
            </div>
            <span className={`inline-block px-2 rounded ${getSeverityStyles(severity)}`}>
                {severity}
            </span>
            <p className="my-3 font-normal text-gray-700 dark:text-gray-400 h-[100px] overflow-y-auto custom-scrollbar">
                {description}
            </p>
            <div className="border-t border-gray-300 my-4"></div>
            <div className="text-right text-sm text-gray-700 dark:text-gray-400 italic">Created by {reporter} at {moment(dateTime).format('MM/DD/YYYY')}</div>
        </div>

    );
};

export default ReportCard;
