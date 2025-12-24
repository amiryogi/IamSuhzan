import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMail, HiTrash, HiCheck, HiX, HiEye, HiUser, HiCalendar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { messagesAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const MessageInbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await messagesAPI.getAll();
            setMessages(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const toggleRead = async (id, currentStatus) => {
        try {
            await messagesAPI.updateStatus(id, !currentStatus);
            setMessages((prev) =>
                prev.map((msg) => (msg._id === id ? { ...msg, isRead: !currentStatus } : msg))
            );
            if (selectedMessage?._id === id) {
                setSelectedMessage((prev) => ({ ...prev, isRead: !currentStatus }));
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await messagesAPI.delete(id);
            setMessages((prev) => prev.filter((msg) => msg._id !== id));
            if (selectedMessage?._id === id) setSelectedMessage(null);
            toast.success('Message deleted');
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Message List */}
            <div className="lg:col-span-1 bg-dark-100 rounded-xl overflow-hidden flex flex-col border border-dark-300">
                <div className="p-4 border-b border-dark-300 bg-dark-200">
                    <h2 className="text-lg font-display font-semibold text-light flex items-center gap-2">
                        <HiMail className="text-primary" /> Inbox
                        <span className="text-xs font-normal text-dark-400 bg-dark-300 px-2 py-0.5 rounded-full">
                            {messages.filter(m => !m.isRead).length} new
                        </span>
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-dark-300">
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            onClick={() => setSelectedMessage(msg)}
                            className={`p-4 cursor-pointer transition-colors hover:bg-dark-200 ${selectedMessage?._id === msg._id ? 'bg-dark-200 border-l-4 border-primary' : ''
                                } ${!msg.isRead ? 'bg-dark-200/50' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-medium ${!msg.isRead ? 'text-light' : 'text-light-300'}`}>
                                    {msg.name}
                                </span>
                                <span className="text-[10px] text-dark-400">
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-primary mb-2 uppercase tracking-tighter">{msg.subject}</p>
                            <p className="text-xs text-dark-400 truncate">{msg.message}</p>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <div className="p-8 text-center text-dark-400">
                            <HiMail size={32} className="mx-auto mb-2 opacity-20" />
                            <p>No messages yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2 bg-dark-100 rounded-xl overflow-hidden border border-dark-300">
                <AnimatePresence mode="wait">
                    {selectedMessage ? (
                        <motion.div
                            key={selectedMessage._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-dark-300 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-display font-semibold text-light mb-1">
                                        {selectedMessage.subject.charAt(0).toUpperCase() + selectedMessage.subject.slice(1)}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-dark-400">
                                        <span className="flex items-center gap-1">
                                            <HiUser className="text-primary" /> {selectedMessage.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <HiMail className="text-primary" /> {selectedMessage.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <HiCalendar className="text-primary" /> {new Date(selectedMessage.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleRead(selectedMessage._id, selectedMessage.isRead)}
                                        className={`p-2 rounded-lg transition-colors ${selectedMessage.isRead
                                            ? 'bg-dark-300 text-dark-400 hover:text-light'
                                            : 'bg-primary text-dark hover:bg-primary-dark'
                                            }`}
                                        title={selectedMessage.isRead ? 'Mark as unread' : 'Mark as read'}
                                    >
                                        {selectedMessage.isRead ? <HiX size={20} /> : <HiCheck size={20} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedMessage._id)}
                                        className="p-2 rounded-lg bg-dark-300 text-dark-400 hover:bg-error hover:text-light transition-colors"
                                    >
                                        <HiTrash size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 p-8 overflow-y-auto">
                                <div className="bg-dark-200 rounded-2xl p-6 text-light-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedMessage.message}
                                </div>
                            </div>

                            {/* Action */}
                            <div className="p-4 bg-dark-200 text-center border-t border-dark-300">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: Portfolio Inquiry: ${selectedMessage.subject}`}
                                    className="btn btn-primary px-8"
                                >
                                    Reply via Email
                                </a>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-dark-400 flex-col p-8 text-center">
                            <HiEye size={48} className="mb-4 opacity-20" />
                            <p className="text-lg">Select a message from the inbox to read</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MessageInbox;
