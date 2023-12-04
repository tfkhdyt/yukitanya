'use client';

import { LinkIcon } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappIcon,
	WhatsappShareButton,
	XIcon,
} from 'react-share';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function ShareDropdown({
	children,
	url,
}: {
	children: ReactNode;
	url: URL;
}) {
	const [copied, setCopied] = useState(false);
	const [open, setOpen] = useState(false);

	const handleCopyLinkClick = async () => {
		// Logic to copy the link goes here (if needed)
		await navigator.clipboard.writeText(url.href);

		// Update the state to indicate that the link has been copied
		setCopied(true);

		// Reset the state after a delay (e.g., 2 seconds)
		setTimeout(() => {
			setCopied(false);
		}, 500);
	};

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger
				asChild
				onPointerDown={(e) => e.preventDefault()}
				onClick={() => setOpen((v) => !v)}
			>
				{children}
			</DropdownMenuTrigger>
			<DropdownMenuContent className='text-[#696984]'>
				<DropdownMenuLabel>Bagikan ke...</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<FacebookShareButton url={url.href} className='block w-full'>
					<DropdownMenuItem className='flex cursor-pointer items-center'>
						<FacebookIcon className='mr-2' size={18} round />
						<span>Facebook</span>
					</DropdownMenuItem>
				</FacebookShareButton>
				<TwitterShareButton url={url.href} className='block w-full'>
					<DropdownMenuItem className='flex cursor-pointer items-center'>
						<XIcon className='mr-2' size={18} round />
						<span>X</span>
					</DropdownMenuItem>
				</TwitterShareButton>
				<TelegramShareButton url={url.href} className='block w-full'>
					<DropdownMenuItem className='flex cursor-pointer items-center'>
						<TelegramIcon className='mr-2' size={18} round />
						<span>Telegram</span>
					</DropdownMenuItem>
				</TelegramShareButton>
				<WhatsappShareButton url={url.href} className='block w-full'>
					<DropdownMenuItem className='flex cursor-pointer items-center'>
						<WhatsappIcon className='mr-2' size={18} round />
						<span>WhatsApp</span>
					</DropdownMenuItem>
				</WhatsappShareButton>
				<DropdownMenuItem
					onClick={handleCopyLinkClick}
					onSelect={(event) => event.preventDefault()}
				>
					<LinkIcon className='mr-2' size={18} />
					<span>{copied ? 'Tersalin' : 'Salin link'}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
