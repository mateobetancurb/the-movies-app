"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends ImageProps {
	fallback: React.ReactNode;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
	src,
	fallback,
	...rest
}) => {
	const [hasError, setHasError] = useState(false);

	return hasError || !src ? (
		<>{fallback}</>
	) : (
		<Image src={src} {...rest} onError={() => setHasError(true)} />
	);
};

export default ImageWithFallback;
