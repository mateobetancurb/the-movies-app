"use client";

import React, { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	type?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	type = "danger",
}) => {
	// Handle escape key press
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			// Prevent body scroll when modal is open
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const getIconColor = () => {
		switch (type) {
			case "danger":
				return "text-red-500";
			case "warning":
				return "text-yellow-500";
			case "info":
				return "text-blue-500";
			default:
				return "text-red-500";
		}
	};

	const getConfirmButtonVariant = () => {
		switch (type) {
			case "danger":
				return "destructive";
			case "warning":
				return "destructive";
			case "info":
				return "default";
			default:
				return "destructive";
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={handleBackdropClick}
		>
			{/* backdrop */}
			<div className="absolute inset-0 bg-black/70 animate-in fade-in duration-300" />

			{/* modal */}
			<div className="relative bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
				{/* header */}
				<div className="flex items-center justify-between p-6 pb-4">
					<div className="flex items-center gap-3">
						<div className={`p-2 rounded-full bg-gray-800 ${getIconColor()}`}>
							<AlertTriangle className="w-5 h-5" />
						</div>
						<h2 className="text-lg font-semibold text-white">{title}</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-md hover:bg-gray-800"
						aria-label="Close modal"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* message */}
				<div className="px-6 pb-4">
					<p className="text-gray-300 leading-relaxed">{message}</p>
				</div>

				{/* buttons */}
				<div className="flex gap-3 p-6 pt-4 border-t border-gray-700">
					<Button
						variant="outline"
						onClick={onClose}
						className="flex-1 border-gray-600 text-gray-700 hover:bg-gray-800 hover:text-white transition-all duration-200"
					>
						{cancelText}
					</Button>
					<Button
						variant={getConfirmButtonVariant()}
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className="flex-1 transition-all duration-200"
					>
						{confirmText}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
