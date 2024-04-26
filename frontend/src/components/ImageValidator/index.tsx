import React, { useState } from 'react';

const ImageValidator = ({ url, altText, altImagePath} : {
    url : string,
    altText : string,
    altImagePath : string
}) => {
    const [isValid, setIsValid] = useState(false);  // null, true, or false

    const handleImageLoaded = () => {
        setIsValid(true);
    };

    const handleImageError = () => {
        setIsValid(false);
    };

    return (
        <div>
            {/* Image element for testing the URL */}
            <img
                src={url}
                alt="Validation Check"
                onLoad={handleImageLoaded}
                onError={handleImageError}
                style={{ display: 'none' }}  // Hide the image as it's only for validation
            />
            {/* Conditionally display status based on the image load result */}
            {isValid !== null && isValid ? (
                <img src={url} alt={altText} /> 
            ) : (
                <img src={require(altImagePath)} alt={altText} />
            )}
        </div>
    );
};

export default ImageValidator;