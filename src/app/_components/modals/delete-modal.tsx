import { type ReactNode } from 'react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog';

export function DeleteModal({
	children,
	description,
	onClick,
	onOpenChange,
	open,
	title,
}: {
	children: ReactNode;
	description: string;
	onClick: () => void;
	onOpenChange: (open: boolean) => void;
	open?: boolean;
	title: string;
}) {
	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Batalkan</AlertDialogCancel>
					<AlertDialogAction
						className='bg-red-500 hover:bg-red-600'
						onClick={onClick}
					>
						Hapus
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
