// components/Modal.tsx
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

// redux
import { incidentAsync } from '@/redux/incidentSlice';

interface ModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

interface FormData {
    dateTime: string;
    description: string;
    severity: string;
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 400
    },
};

const MyModal: React.FC<ModalProps> = ({ isOpen, onRequestClose }) => {
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue } = useForm<FormData>();

    // Set the app element for accessibility
    useEffect(() => {
        Modal.setAppElement('#__next');
    }, []);

    const onSubmit = async (data: FormData) => {
        // Handle form submission here
        try {
            await dispatch(incidentAsync({ ...data }));
            handleRequestClose();
        } catch (err) {
            console.log(err)
        }
    };

    const handleRequestClose = () => {
        setValue('dateTime', '');
        setValue('description', '');
        setValue('severity', 'Minimal');
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleRequestClose}
            style={customStyles}
            contentLabel="Incident Modal"
        >
            <div className="max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-end">
                    <button
                        onClick={handleRequestClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* date and time of incident */}
                    <div className="mb-4">
                        <label htmlFor="dateTime" className="block">
                            Date and Time of Incident
                        </label>
                        <input
                            type="datetime-local"
                            id="dateTime"
                            {...register('dateTime', { required: 'This field is required' })}
                            className="mt-1 p-2 border rounded-md w-full text-black"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block">
                            Description
                        </label>
                        <textarea
                            id="description"
                            {...register('description', { required: 'This field is required' })}
                            className="mt-1 p-2 border rounded-md w-full text-black"
                            rows={4}
                        />
                    </div>

                    {/* Severity Level */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">
                            Severity Level
                        </label>
                        <select
                            {...register('severity', { required: 'This field is required' })}
                            className="w-full border border-gray-300 p-2 rounded text-black"
                        >
                            {SEVERITY.map((sev) => (
                                <option key={sev} value={sev}>{sev}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 "
                        >
                            Submit
                        </button>
                    </div>

                </form>
            </div>

        </Modal>
    );
};

export default MyModal;

const SEVERITY = ['Minimal', 'Moderate', 'High', 'Severe', 'Catastrophic'];