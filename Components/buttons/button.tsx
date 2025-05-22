import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-green-700 text-white hover:bg-green-500',
				destructive:
					'bg-red-700 text-destructive-foreground hover:bg-red-700/90',
				outline:
					'border border-input bg-background hover:bg-green-900 hover:text-accent-foreground',
				secondary: 'bg-secondary text-primary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				xs: 'h-7 rounded-md px-3',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant, size, asChild = false, isLoading = false, ...props },
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={twMerge([buttonVariants({ variant, size, className })])}
				ref={ref}
				disabled={isLoading}
				{...props}
			>
				{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
				{props.children}
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
