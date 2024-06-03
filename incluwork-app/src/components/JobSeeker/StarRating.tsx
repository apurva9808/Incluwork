import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';

interface StarRatingProps {
    initialRating: number;
    onRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ initialRating, onRating }) => {
    const [rating, setRating] = useState(initialRating);

    const handleRating = (newRating: number) => {
        setRating(newRating);
        onRating(newRating);
    };

    return (
        <Box>
            {[...Array(5)].map((_, index) => (
                <IconButton
                    key={index}
                    onClick={() => handleRating(index + 1)}
                    color="primary"
                >
                    {rating > index ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
            ))}
        </Box>
    );
};

export default StarRating;
