type ISvg = {
	className?: string;
	width?: string;
	height?: string;
	color?: string;
};

export default function ClearSVG({
	width = '24',
	height = '24',
	className,
	color = '#222222',
}: ISvg) {
	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g clipPath="url(#clip0_304_820)">
				<path
					d="M11.0833 3.73913L10.2608 2.91663L7 6.17746L3.73917 2.91663L2.91667 3.73913L6.1775 6.99996L2.91667 10.2608L3.73917 11.0833L7 7.82246L10.2608 11.0833L11.0833 10.2608L7.8225 6.99996L11.0833 3.73913Z"
					fill={color}
				/>
			</g>
		</svg>
	);
}
