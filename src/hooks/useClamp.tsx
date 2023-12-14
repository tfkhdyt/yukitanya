import { useEffect, useRef, useState } from 'react';

export function useClamp() {
	const [isOpen, setIsOpen] = useState(false);
	const [showReadMoreButton, setShowReadMoreButton] = useState(false);

	const ref = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		const checkHeight = () => {
			setShowReadMoreButton(
				ref.current?.scrollHeight !== ref.current?.clientHeight,
			);
		};

		checkHeight();
		window.addEventListener('resize', checkHeight);

		return () => {
			window.removeEventListener('resize', checkHeight);
		};
	}, []);

	return { isOpen, setIsOpen, showReadMoreButton, ref };
}
