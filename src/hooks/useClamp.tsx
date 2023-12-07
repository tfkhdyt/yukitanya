import { useEffect, useRef, useState } from 'react';

export function useClamp() {
	const [isOpen, setIsOpen] = useState(false);
	const [showReadMoreButton, setShowReadMoreButton] = useState(false);

	const ref = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		if (ref.current) {
			setShowReadMoreButton(
				ref.current.scrollHeight !== ref.current.clientHeight,
			);
		}
	}, []);

	return { isOpen, setIsOpen, showReadMoreButton, ref };
}
