'use client';

import { BanknoteIcon } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { match } from 'ts-pattern';

import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { environment } from '@/environment.mjs';
import { User } from '@/server/auth';
import { api } from '@/trpc/react';
import toast from 'react-hot-toast';

function calculatePrice(type: string, duration: number) {
	const price = match(type)
		.with('standard', () => 29_999)
		.with('plus', () => 49_999)
		.otherwise(() => 0);

	const subTotal = price * duration;
	const discount = match(duration)
		.with(3, () => subTotal * 0.1)
		.with(12, () => subTotal * 0.25)
		.otherwise(() => 0);
	const totalPrice = subTotal - discount;

	return totalPrice;
}

const formatter = new Intl.NumberFormat('id-ID', {
	style: 'currency',
	currency: 'IDR',
});

export function PremiumType({ user }: { user: User }) {
	const [type, setType] = useState('standard');
	const [duration, setDuration] = useState('1');

	const { mutate, isLoading } = api.payment.getInvoiceToken.useMutation({
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: (invoiceToken) => {
			// @ts-ignore
			window.snap.pay(invoiceToken);
		},
	});

	useEffect(() => {
		// You can also change below url value to any script url you wish to load,
		// for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
		const midtransScriptUrl = `https://app${
			environment.NEXT_PUBLIC_NODE_ENV === 'production' ? '.' : '.sandbox.'
		}midtrans.com/snap/snap.js`;

		const scriptTag = document.createElement('script');
		scriptTag.src = midtransScriptUrl;

		scriptTag.setAttribute(
			'data-client-key',
			environment.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
		);

		document.body.appendChild(scriptTag);

		return () => {
			document.body.removeChild(scriptTag);
		};
	}, []);

	const handleRadio = (e: ChangeEvent<HTMLInputElement>) => {
		setType(e.target.value);
	};

	const handleSubmit = () => {
		const price = Math.round(calculatePrice(type, Number(duration)));

		mutate({
			user: {
				id: user.id,
				name: user.name ?? user.username,
			},
			price,
			duration: Number(duration),
			premiumType: type,
		});
	};

	return (
		<>
			<div className='md:px-12 mx-auto mt-8 mb-4'>
				<fieldset className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<legend className='sr-only'>Paket Premium</legend>

					<div>
						<input
							type='radio'
							name='premium-type'
							value='standard'
							id='standard'
							className='peer hidden [&:checked_+_label_svg]:block'
							checked={type === 'standard'}
							onChange={handleRadio}
						/>

						<label
							htmlFor='standard'
							className='block cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 text-sm font-semibold shadow-sm hover:border-gray-200 peer-checked:border-[#F48C06] peer-checked:ring-1 peer-checked:ring-[#F48C06]'
						>
							<div className='flex items-center justify-between'>
								<p className='text-gray-700'>Premium</p>

								<svg
									className='hidden h-5 w-5 text-[#F48C06]'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<title>Check</title>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
										clipRule='evenodd'
									/>
								</svg>
							</div>

							<p className='mt-1 text-gray-500'>Rp29.999/bulan</p>
							<ul className='mt-4 text-gray-600 font-normal list-disc ml-4 space-y-1'>
								<li>Dapat Menyisipkan Gambar ke dalam Pertanyaan</li>
								<li>Akses ke Fitur "Favorit" Pertanyaan</li>
								<li>Batas Membuat 10 Pertanyaan/hari</li>
								<li>Premium Badge</li>
							</ul>
						</label>
					</div>

					<div>
						<input
							type='radio'
							name='premium-type'
							value='plus'
							id='plus'
							className='peer hidden [&:checked_+_label_svg]:block'
							checked={type === 'plus'}
							onChange={handleRadio}
						/>

						<label
							htmlFor='plus'
							className='block cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 text-sm font-semibold shadow-sm hover:border-gray-200 peer-checked:border-[#F48C06] peer-checked:ring-1 peer-checked:ring-[#F48C06]'
						>
							<div className='flex items-center justify-between'>
								<p className='text-gray-700'>Premium+</p>

								<svg
									className='hidden h-5 w-5 text-[#F48C06]'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<title>Check</title>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
										clipRule='evenodd'
									/>
								</svg>
							</div>

							<p className='mt-1 text-gray-500'>Rp49.999/bulan</p>
							<ul className='mt-4 text-gray-600 font-normal list-disc ml-4 space-y-1'>
								<li>Dapat Menyisipkan Gambar ke dalam Pertanyaan</li>
								<li>Akses ke Fitur "Favorit" Pertanyaan</li>
								<li>Tanpa Batas</li>
								<li>Premium+ Badge</li>
								<li>Akses ke Fitur "Tanyakan pada AI"</li>
							</ul>
						</label>
					</div>
				</fieldset>
			</div>
			<div className='md:px-12 mb-4'>
				<Select defaultValue={duration} onValueChange={setDuration}>
					<SelectTrigger className='w-fit rounded-full'>
						<SelectValue placeholder='Durasi' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='1'>1 bulan</SelectItem>
						<SelectItem value='3'>3 bulan (Diskon 10%)</SelectItem>
						<SelectItem value='12'>12 bulan (Diskon 25%)</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className='md:px-12'>
				<Button
					size='lg'
					className='w-full font-semibold text-base rounded-full'
					onClick={handleSubmit}
					disabled={isLoading}
				>
					<BanknoteIcon className='mr-2' />
					<span className='truncate'>
						Langganan (
						{formatter.format(
							Math.round(calculatePrice(type, Number(duration))),
						)}
						)
					</span>
				</Button>
			</div>
		</>
	);
}
