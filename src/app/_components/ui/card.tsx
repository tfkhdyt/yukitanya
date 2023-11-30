import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...properties }, reference) => (
	<div
		className={cn(
			'rounded-lg border bg-card text-card-foreground shadow-sm',
			className,
		)}
		ref={reference}
		{...properties}
	/>
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...properties }, reference) => (
	<div
		className={cn('flex flex-col space-y-1.5 p-6', className)}
		ref={reference}
		{...properties}
	/>
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...properties }, reference) => (
	<h3
		className={cn(
			'text-2xl font-semibold leading-none tracking-tight',
			className,
		)}
		ref={reference}
		{...properties}
	/>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...properties }, reference) => (
	<p
		className={cn('text-sm text-muted-foreground', className)}
		ref={reference}
		{...properties}
	/>
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...properties }, reference) => (
	<div className={cn('p-6 pt-0', className)} ref={reference} {...properties} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...properties }, reference) => (
	<div
		className={cn('flex items-center p-6 pt-0', className)}
		ref={reference}
		{...properties}
	/>
));
CardFooter.displayName = 'CardFooter';

export {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
};
