import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
	Controller,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
	FormProvider,
	useFormContext,
} from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Form = FormProvider;

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
);

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...properties
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: properties.name }}>
			<Controller {...properties} />
		</FormFieldContext.Provider>
	);
};

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	const { formState, getFieldState } = useFormContext();

	const fieldState = getFieldState(fieldContext.name, formState);

	if (!fieldContext) {
		throw new Error('useFormField should be used within <FormField>');
	}

	const { id } = itemContext;

	return {
		formDescriptionId: `${id}-form-item-description`,
		formItemId: `${id}-form-item`,
		formMessageId: `${id}-form-item-message`,
		id,
		name: fieldContext.name,
		...fieldState,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

const FormItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...properties }, reference) => {
	const id = React.useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
				className={cn('space-y-2', className)}
				ref={reference}
				{...properties}
			/>
		</FormItemContext.Provider>
	);
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...properties }, reference) => {
	const { error, formItemId } = useFormField();

	return (
		<Label
			className={cn(error && 'text-destructive', className)}
			htmlFor={formItemId}
			ref={reference}
			{...properties}
		/>
	);
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
	React.ElementRef<typeof Slot>,
	React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...properties }, reference) => {
	const { error, formDescriptionId, formItemId, formMessageId } =
		useFormField();

	return (
		<Slot
			aria-describedby={
				error ? `${formDescriptionId} ${formMessageId}` : `${formDescriptionId}`
			}
			aria-invalid={!!error}
			id={formItemId}
			ref={reference}
			{...properties}
		/>
	);
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...properties }, reference) => {
	const { formDescriptionId } = useFormField();

	return (
		<p
			className={cn('text-sm text-muted-foreground', className)}
			id={formDescriptionId}
			ref={reference}
			{...properties}
		/>
	);
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ children, className, ...properties }, reference) => {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error?.message) : children;

	if (!body) {
		return;
	}

	return (
		<p
			className={cn('text-sm font-medium text-destructive', className)}
			id={formMessageId}
			ref={reference}
			{...properties}
		>
			{body}
		</p>
	);
});
FormMessage.displayName = 'FormMessage';

export {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
};
