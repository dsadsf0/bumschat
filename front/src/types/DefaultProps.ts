export type DefaultProps = {
	className?: string;
};

export type InputProps = DefaultProps & {
	type: 'text';
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	title?: string;
	autoFocus?: boolean;
};
