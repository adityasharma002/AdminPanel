import React from 'react';
import {
  Card, CardContent, Box, Typography, styled
} from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px solid ${theme.palette.grey[200]}`,
  width: '300px',
  height: '360px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '200px',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
}));

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
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
  padding: theme.spacing(1.5),
  paddingBottom: theme.spacing(1),
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const ActionContainer = styled(Box)(({ theme }) => ({
  height: '56px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 1.5),
  borderTop: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: theme.palette.grey[50],
}));

const CardDesign = ({
  imageUrl,
  placeholderText = 'No Image',
  placeholderIcon,
  actions,
  children,
}) => {
  return (
    <StyledCard>
      <ImageContainer>
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