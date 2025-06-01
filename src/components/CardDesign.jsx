import React from 'react';
import {
  Card, CardContent, Box, Typography, styled
} from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${theme.palette.grey[200]}`,
  width: '285px', // Fixed width for all cards
  height: '320px', // Fixed height for all cards
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '256px', // Fixed width for the image area
  height: '160px', // Fixed height for the image area
  margin: '0 auto', // Center the image area within the card
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
}));

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover', // Crop the image to fit the fixed area
  objectPosition: 'center',
  display: 'block',
});

const PlaceholderContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.grey[500],
}));

const ContentContainer = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  height: '96px', // Fixed height for content (320px - 160px image - 64px actions)
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const ActionContainer = styled(Box)(({ theme }) => ({
  height: '64px', // Fixed height for actions
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: theme.palette.grey[50],
}));

const CardDesign = ({
  imageUrl,
  placeholderText = 'No Image',
  placeholderIcon,
  imageHeight = '400px', 
  actions,
  children,
}) => {
  return (
    <StyledCard>
      <ImageContainer sx={{ height: imageHeight }}>
        {imageUrl ? (
          <StyledImage src={imageUrl} alt="Card Image" />
        ) : (
          <PlaceholderContainer>
            {placeholderIcon || <ImageIcon sx={{ fontSize: 40, mb: 1 }} />}
            <Typography variant="body2">{placeholderText}</Typography>
          </PlaceholderContainer>
        )}
      </ImageContainer>
      {children}
      {actions && <ActionContainer>{actions}</ActionContainer>}
    </StyledCard>
  );
};

export default CardDesign;