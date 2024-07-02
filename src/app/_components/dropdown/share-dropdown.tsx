'use client';

import { CheckIcon, LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';

import { match } from 'ts-pattern';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function openInNewTab(url: string) {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
}

function isMobileOrTablet() {
  return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
}

function handleShare(
  target: 'Facebook' | 'X' | 'WhatsApp' | 'Telegram',
  url: string,
) {
  match(target)
    .with('Facebook', () => {
      openInNewTab(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url,
        )}`,
      );
    })
    .with('X', () => {
      openInNewTab(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      );
    })
    .with('Telegram', () => {
      openInNewTab(
        `https://telegram.me/share/url?url=${encodeURIComponent(url)}`,
      );
    })
    .with('WhatsApp', () => {
      openInNewTab(
        `https://${
          isMobileOrTablet() ? 'api' : 'web'
        }.whatsapp.com/send?text=${encodeURIComponent(url)}`,
      );
    })
    .exhaustive();
}

export function ShareDropdown({
  children,
  url,
}: {
  children: ReactNode;
  url: URL;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
        onPointerDown={(e) => {
          e.preventDefault();
        }}
        onClick={() => {
          setOpen((v) => !v);
        }}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='text-[#696984]'>
        <DropdownMenuLabel>Bagikan ke...</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='flex items-center cursor-pointer'
          onClick={() => {
            handleShare('Facebook', url.href);
          }}
        >
          <Image
            src='/img/icon/facebook.svg'
            height={20}
            width={20}
            className='mr-2'
            alt='Facebook'
          />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center cursor-pointer'
          onClick={() => {
            handleShare('X', url.href);
          }}
        >
          <Image
            src='/img/icon/twitter.svg'
            height={20}
            width={20}
            className='mr-2'
            alt='X'
          />
          <span>X</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center cursor-pointer'
          onClick={() => {
            handleShare('Telegram', url.href);
          }}
        >
          <Image
            src='/img/icon/telegram.svg'
            height={20}
            width={20}
            className='mr-2'
            alt='Telegram'
          />
          <span>Telegram</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center cursor-pointer'
          onClick={() => {
            handleShare('WhatsApp', url.href);
          }}
        >
          <Image
            src='/img/icon/whatsapp.svg'
            height={20}
            width={20}
            className='mr-2'
            alt='WhatsApp'
          />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleCopyLinkClick}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <span className='flex items-center'>
            {copied ? (
              <>
                <CheckIcon className='mr-2' size={20} />
                Tersalin!
              </>
            ) : (
              <>
                <LinkIcon className='mr-2' size={20} />
                Salin link
              </>
            )}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
